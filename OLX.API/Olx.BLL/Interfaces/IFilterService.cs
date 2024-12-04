using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Models;
using Olx.BLL.Models.Filter;
using Olx.BLL.Pagination;


namespace Olx.BLL.Interfaces
{
    public interface IFilterService
    {
        Task<PageResponse<FilterDto>> GetPageAsync(FilterPageRequest pageRequest);
        Task<IEnumerable<FilterDto>> GetAll();
        Task<IEnumerable<Filter>> GetByIds(IEnumerable<int> ids,bool tracking = false);
        Task<IEnumerable<FilterDto>> GetDtoByIds(IEnumerable<int> ids, bool tracking = false);
        Task CreateAsync(FilterCreationModel filterModel);
        Task RemoveAsync(int id);
        Task EditAsync(FilterCreationModel filterModel);
    }
}
