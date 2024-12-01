
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.Interfaces
{
    public interface IFilterService
    {
        Task AddFilterAsync(Filter filter);
        Task AddFiltersAsync(IEnumerable<Filter> filters);
        Task AddFilterAsync(string filterName,IEnumerable<string>? values = null);
        Task AddValueAsync(FilterValue filterValue);
        Task AddValueAsync(string value);
        Task AddValuesAsync(IEnumerable<string> values, Filter? filter = null);
        Task AddValuesAsync(IEnumerable<FilterValue> values);
        Task<int> FiltersCountAsync();
        Task<bool> IsFiltersAsync();
    }
}
