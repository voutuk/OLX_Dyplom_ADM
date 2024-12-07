using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities.FilterEntities;
using System;

namespace Olx.BLL.Interfaces
{
    public interface IFilterValueService
    {
        Task<IEnumerable<FilterValueDto>> GetAllAsync();
        Task<IEnumerable<FilterValue>> GetByIdsAsync(IEnumerable<int> ids, bool tracking = false);
        Task<IEnumerable<FilterValueDto>> GetDtoByIdsAsync(IEnumerable<int> ids, bool tracking = false);
    }
}
