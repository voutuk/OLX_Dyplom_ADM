using Olx.BLL.DTOs;
using Olx.BLL.Models.Advert;
using Olx.BLL.Models.Page;

namespace Olx.BLL.Interfaces
{
    public interface IAdvertService
    {
        Task<PageResponse<AdvertDto>> GetPageAsync(AdvertPageRequest pageRequest);
        Task<IEnumerable<AdvertDto>> GetAllAsync();
        Task<IEnumerable<AdvertDto>> GetByEmailAsync(string userEmail);
        Task<AdvertDto> GetByIdAsync(int id);
        Task<IEnumerable<AdvertDto>> GetAdvertsAsync(int[] ids);
        Task<IEnumerable<AdvertImageDto>> GetImagesAsync(int id);
        Task CreateAsync(AdvertCreationModel advertModel);
        Task UpdateAsync(AdvertCreationModel advertModel);
        Task DeleteAsync(int id);
    }
}
