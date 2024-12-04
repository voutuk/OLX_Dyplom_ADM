using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Models;

namespace Olx.BLL.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync(bool tracking = false);
        Task<IEnumerable<CategoryDto>> GetMainAsync(bool tracking = false);
        Task<CategoryChildsTreeDto> GetTreeAsync(int categoryId,bool tracking = false);
        Task<IEnumerable<CategoryChildsTreeDto>> GetMainTreeAsync(bool tracking = false);
        Task CreateAsync(CategoryCreationModel creationModel);
        Task RemoveAsync(int id);
        Task EditAsync(CategoryCreationModel editModel);
    }
}
