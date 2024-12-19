using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Olx.BLL.Entities.NewPost;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.NewPost;
using Olx.BLL.Resources;
using System.Net;
using System.Text;

namespace Olx.BLL.Services
{
    
    public class NewPostService(
        IConfiguration configuration,
        IRepository<Area> areaRepository) : INewPostService
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
                        return result.Data.GroupBy(x => x.Ref).Select(z => z.Single());
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
            return warehouses;
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
            return settlement;
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
            return result.SelectMany(x => x);
        }

        public async Task<NewPostData> GetNewPostDataAsync()
        {
            Console.WriteLine("Завантаження даних Нової Пошти ...");
            NewPostData newPostData = new()
            {
                Areas = await GetAreasAsync()
            };
            Console.WriteLine($"Області - {newPostData.Areas.Count()}");
            var tasks = Enumerable.Range(1, 3).AsParallel().Select(async (index) =>
            {
                switch (index)
                {
                    case 1:
                        newPostData.Warehous = await GetWarehousesAsync();
                        Console.WriteLine($"Відділення - {newPostData.Warehous.Count()}");
                        break;
                    case 2:
                        newPostData.Regions = await GetRegionsAsync(newPostData.Areas.Select(x => x.Ref));
                        Console.WriteLine($"Paйони - {newPostData.Regions.Count()}");
                        break;
                    case 3:
                        newPostData.Settlements = await GetSettlementsAsync();
                        Console.WriteLine($"Населені пункти - {newPostData.Settlements.Count()}");
                        break;
                }
            });
            await Task.WhenAll(tasks);
            return newPostData;
        }
        public async Task SeedNewPostDataAsync()
        {
            var newPostData = await GetNewPostDataAsync();
            Console.WriteLine("Підготовка даних Нової Пошти до завантяження в базу даних...");
            var areas = newPostData.Areas.Select( async area => 
            {
                var regions = newPostData.Regions.Where(x=>x.AreaRef == area.Ref).Select(region => 
                {
                    var settlements = newPostData.Settlements.Where(x => x.Region == region.Ref).Select(settlement => 
                    {
                        var warehouses = newPostData.Warehous.Where(x => x.SettlementRef == settlement.Ref);
                        settlement.Warehous = warehouses.ToArray();
                        return settlement;
                    });
                    region.Settlements = settlements.ToArray();
                    return region;
                });
                area.Regions = regions.ToArray();
                await areaRepository.AddAsync(area);
                Console.WriteLine("Завантаження даних Нової Пошти в базу даних...");
                await areaRepository.SaveAsync();
            });
            await Task.WhenAll(areas);
           
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
