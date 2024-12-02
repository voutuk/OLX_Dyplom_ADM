
using Olx.BLL.DTOs;
using Olx.BLL.Models;

namespace Olx.BLL.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync(bool tracking = false);
        Task<IEnumerable<CategoryDto>> GetMainAsync(bool tracking = false);
        Task CreateAsync(CategoryCreationModel creationModel);
        Task RemoveAsync(int id);
        Task EditAsync(CategoryCreationModel editModel);
    }
}
