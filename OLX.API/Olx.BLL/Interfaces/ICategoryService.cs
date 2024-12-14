using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Models.Category;
using Olx.BLL.Models.Page;

namespace Olx.BLL.Interfaces
{
    public interface ICategoryService
    {
        Task<PageResponse<CategoryDto>> GetPageAsync(CategoryPageRequest pageRequest);
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<IEnumerable<CategoryDto>> GetMainAsync();
        Task<CategoryChildsTreeDto> GetTreeAsync(int categoryId);
        Task<IEnumerable<CategoryChildsTreeDto>> GetMainTreeAsync();
        Task<CategoryDto> CreateAsync(CategoryCreationModel creationModel);
        Task RemoveAsync(int id);
        Task<CategoryDto> EditAsync(CategoryCreationModel editModel);
    }
}
