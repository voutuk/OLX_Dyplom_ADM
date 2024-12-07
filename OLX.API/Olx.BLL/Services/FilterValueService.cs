using AutoMapper;
using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Interfaces;
using Olx.BLL.Specifications;



namespace Olx.BLL.Services
{
    public class FilterValueService(
        IRepository<FilterValue> valueRepository,
        IMapper mapper) : IFilterValueService
    {
        
        public async Task<IEnumerable<FilterValue>> GetByIdsAsync(IEnumerable<int> ids, bool tracking = false) => 
            await valueRepository.GetListBySpec(new FilterValueSpecs.GetByIds(ids, tracking));

        public async Task<IEnumerable<FilterValueDto>> GetDtoByIdsAsync(IEnumerable<int> ids, bool tracking = false) =>
              mapper.Map<IEnumerable<FilterValueDto>>(await GetByIdsAsync(ids, tracking));

        public async Task<IEnumerable<FilterValueDto>> GetAllAsync() =>
            mapper.Map<IEnumerable<FilterValueDto>>(await valueRepository.GetListBySpec(new FilterValueSpecs.GetAll()));
    }
}
