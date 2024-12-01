using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Interfaces;


namespace Olx.BLL.Services
{
    public class FilterService(
        IRepository<Filter> filterRepository,
        IRepository<FilterValue> valueRepository
        ) : IFilterService
    {
        public async Task AddFilterAsync(Filter filter)
        {
            await filterRepository.AddAsync(filter);
            await filterRepository.SaveAsync();
        }
     
        public async Task AddFilterAsync(string filterName, IEnumerable<string>? values = null)
        {
            var filter = new Filter() { Name = filterName };
            if(values is not null)
               filter.Values = values.Select(x=> new FilterValue() {Value = x }).ToHashSet();
            await AddFilterAsync(filter);
        }

        public async Task AddFiltersAsync(IEnumerable<Filter> filters)
        {
            await filterRepository.AddRangeAsync(filters);
            await filterRepository.SaveAsync();
        }

        public async Task AddValueAsync(FilterValue filterValue)
        {
            await valueRepository.AddAsync(filterValue);
            await valueRepository.SaveAsync();
        }

        public async Task AddValueAsync(string value) => await AddValueAsync(new FilterValue() { Value = value });

        public async Task AddValuesAsync(IEnumerable<FilterValue> values) 
        {
            await valueRepository.AddRangeAsync(values);
            await valueRepository.SaveAsync();
        } 

        public async Task  AddValuesAsync(IEnumerable<string> values, Filter? filter = null) 
        {
            var valueEntities = values.Select(x=>new FilterValue() {Value = x});
            await AddValuesAsync(valueEntities);
        }

        public async Task<int> FiltersCountAsync() => await filterRepository.CountAsync();

        public async Task<bool> IsFiltersAsync() => await filterRepository.AnyAsync();
        
    }
}
