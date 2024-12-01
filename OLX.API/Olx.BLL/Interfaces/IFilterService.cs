using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Models;


namespace Olx.BLL.Interfaces
{
    public interface IFilterService
    {
        Task<IEnumerable<FilterDto>> GetAll();
        Task<IEnumerable<Filter>> GetByIds(IEnumerable<int> ids,bool tracking = false);
        Task<IEnumerable<FilterDto>> GetDtoByIds(IEnumerable<int> ids, bool tracking = false);
        Task CreateAsync(Filter filter);
        Task CreateAsync(FilterCreationModel filterModel);
        Task CreateAsync(IEnumerable<Filter> filters);
        Task CreateAsync(string filterName,IEnumerable<string>? values = null);
        Task<int> CountAsync();
        Task<bool> IsFiltersAsync();
        Task RemoveAsync(int id);
        Task EditAsync(FilterCreationModel filterModel);
    }
}
