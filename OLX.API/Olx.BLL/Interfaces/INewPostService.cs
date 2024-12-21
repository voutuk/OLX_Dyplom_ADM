

using Olx.BLL.Entities.NewPost;
using Olx.BLL.Models.NewPost;
using System.Threading.Tasks;

namespace Olx.BLL.Interfaces
{
    public interface INewPostService : IDisposable
    {
        Task<IEnumerable<Area>> GetAreasAsync() ;
        Task<IEnumerable<Warehous>> GetWarehousesAsync();
        Task<IEnumerable<Settlement>> GetSettlementsAsync();
        Task<IEnumerable<Region>> GetRegionsAsync(IEnumerable<string> areaRefs);
       // Task<NewPostData> GetNewPostDataAsync();
        Task SeedNewPostDataAsync();
    }
}
