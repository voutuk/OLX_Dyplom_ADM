using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Olx.BLL.Entities.NewPost;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.NewPost;
using Olx.BLL.Resources;
using System.IO.Pipelines;
using System.Net;
using System.Text;

namespace Olx.BLL.Services
{
    
    public class NewPostService(
        IConfiguration configuration,
        IRepository<Area> areaRepository,
        IRepository<Region> regionRepository,
        IRepository<Warehous> warehousRepository,
        IRepository<Settlement> settlementRepository) : INewPostService
    {
        private bool _disposedValue;
        private readonly HttpClient _httpClient = new();
        private readonly string _newPostKey = configuration.GetValue<string>("NewPostApiKey")!;
        private readonly string _newPostUrl = configuration.GetValue<string>("NewPostApiUrl")!;
        private async Task<IEnumerable<T>> GetNewPostData<T>(string modelName, string calledMethod,int page = 1,int limit = 200,string areaRef = "") where T : NewPostBaseEntity
        {
            NewPostRequestModel postModel = new(_newPostKey, modelName, calledMethod,page,limit, areaRef);
            string json = JsonConvert.SerializeObject(postModel);
            HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.PostAsync(_newPostUrl, content);
            if (response.IsSuccessStatusCode)
            {
                var requestResult = await response.Content.ReadAsStringAsync();
                if (requestResult is not null)
                {
                    var result = JsonConvert.DeserializeObject <NewPostResponseModel<T>>(requestResult);
                    if (result != null && result.Data.Length != 0)
                    {
                        return result.Data;
                    }
                }
                return [];
            }
            else
            {
                throw new HttpException(Errors.NewPostRequestError, HttpStatusCode.InternalServerError);
            }
        }
        public async Task<IEnumerable<Area>> GetAreasAsync() => await GetNewPostData<Area>("Address", "getSettlementAreas");
        

        public async Task<IEnumerable<Warehous>> GetWarehousesAsync()
        {
            List<Warehous> warehouses = [];
            int page = 1;

            while (true)
            {
                var result = await GetNewPostData<Warehous>("Address", "getWarehouses", page++, 1000);
                if (result.Any())
                {
                    warehouses.AddRange(result);
                }
                else break;
            };
            return warehouses.AsParallel().GroupBy(x => x.Ref).Select(z => z.First());
        }

        public async Task<IEnumerable<Settlement>> GetSettlementsAsync()
        {
            List<Settlement> settlement = [];
            int page = 1;

            while (true)
            {
                var result = await GetNewPostData<Settlement>("Address", "getSettlements", page++);
                if (result.Any())
                {
                    settlement.AddRange(result);
                }
                else break;
            };
            return settlement.AsParallel().GroupBy(x => x.Ref).Select(z => z.First());
        }

        public async Task<IEnumerable<Region>> GetRegionsAsync(IEnumerable<string> areaRefs)
        {
            var  regionTasks =  areaRefs.AsParallel().Select(async(areaRef) => 
            {
                List<Region> regions = [];
                int page = 1;
                while (true)
                {
                    var result = await GetNewPostData<Region>("Address", "getSettlementCountryRegion", page++, areaRef: areaRef);
                    if (result.Any())
                    {
                        result.AsParallel().ForAll(z => z.AreaRef = areaRef);
                        regions.AddRange(result);
                    }
                    else break;
                };
                return regions;
            });

            var result = await Task.WhenAll(regionTasks);
            return result.SelectMany(x => x).GroupBy(x => x.Ref).Select(z => z.First());
        }

        public async Task SeedNewPostDataAsync()
        {
            //Console.WriteLine("Start");
            //var settlements = await GetWarehousesAsync();
            //var sRefs = settlements.Select(x => x.Ref);
            //var warehouses = await GetWarehousesAsync();
            //foreach (var item in warehouses)
            //{
            //    if (!sRefs.Contains(item.SettlementRef))
            //    {
            //        Console.WriteLine($"Ref - {item.Ref} SRef - {it}  Description - {item.Description}" );
            //    }
            //}
            //Console.WriteLine("End");
            //await Task.Delay(2000000);
            //return;

            Console.WriteLine("Завантаження даних Нової Пошти ...");
            var areasTask = GetAreasAsync().ContinueWith( async x =>
            {
                var regionsTask = GetRegionsAsync(x.Result.Select(x => x.Ref));
                Console.WriteLine($"Областей - {x.Result.Count()}");
                await areaRepository.AddRangeAsync(x.Result);
                await areaRepository.SaveAsync();
               
                var regions = await regionsTask;
                Console.WriteLine($"Районів - {regions.Count()}");
                await regionRepository.AddRangeAsync(regions);
                await regionRepository.SaveAsync();
            });
           

            var settlementsTask = GetSettlementsAsync().ContinueWith(async x =>
            {
                await areasTask;
                Console.WriteLine($"Населених пунктів - {x.Result.Count()}");
                await settlementRepository.AddRangeAsync(x.Result);
                await settlementRepository.SaveAsync();
            });

            var warehousTask = GetWarehousesAsync().ContinueWith(async x =>
            {
                await settlementsTask;
                Console.WriteLine($"Відділень - {x.Result.Count()}");
                await warehousRepository.AddRangeAsync(x.Result);
                await warehousRepository.SaveAsync();
            });

            await warehousTask;
            Console.WriteLine("Завантаження даних Нової Пошти завершено...");
        }
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposedValue)
            {
                if (disposing)
                {
                    _httpClient.Dispose();
                }
                _disposedValue = true;
            }
        }
        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
