using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using System;

namespace Olx.BLL.Interfaces
{
    public interface IFilterValueService
    {
        Task<IEnumerable<FilterValueDto>> GetAllAsync();
        Task<IEnumerable<FilterValue>> GetByIdsAsync(IEnumerable<int> ids, bool tracking = false);
        Task<IEnumerable<FilterValueDto>> GetDtoByIdsAsync(IEnumerable<int> ids, bool tracking = false);
        Task CreateAsync(string value);
        Task CreateAsync(IEnumerable<string> values);
        Task RemoveAsync(int id);
        Task RemoveRangeAsync(IEnumerable<int> ids);
        Task EditAsync(int id,string name);
    }
}
