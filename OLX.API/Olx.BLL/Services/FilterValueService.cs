using AutoMapper;
using Microsoft.IdentityModel.Abstractions;
using Newtonsoft.Json.Linq;
using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;


namespace Olx.BLL.Services
{
    public class FilterValueService(
        IRepository<FilterValue> valueRepository,
        IMapper mapper) : IFilterValueService
    {
        public async Task CreateAsync(FilterValue filterValue)
        {
            await valueRepository.AddAsync(filterValue);
            await valueRepository.SaveAsync();
        }

        public async Task CreateAsync(string value) => await CreateAsync(new FilterValue() { Value = value });

        public async Task CreateAsync(IEnumerable<FilterValue> values)
        {
            await valueRepository.AddRangeAsync(values);
            await valueRepository.SaveAsync();
        }

        public async Task CreateAsync(IEnumerable<string> values)
        {
            var valueEntities = values.Select(x => new FilterValue() { Value = x });
            await CreateAsync(valueEntities);
        }

        public async Task<IEnumerable<FilterValue>> GetByIdsAsync(IEnumerable<int> ids, bool tracking = false) => await valueRepository.GetListBySpec(new FilterValueSpecs.GetByIds(ids, tracking));

        public async Task<IEnumerable<FilterValueDto>> GetDtoByIdsAsync(IEnumerable<int> ids, bool tracking = false) =>
              mapper.Map<IEnumerable<FilterValueDto>>(await GetByIdsAsync(ids, tracking));

        public async Task<IEnumerable<FilterValueDto>> GetAllAsync() =>
            mapper.Map<IEnumerable<FilterValueDto>>(await valueRepository.GetListBySpec(new FilterValueSpecs.GetAll()));

        public async Task RemoveAsync(int id)
        {
            var value = await valueRepository.GetByIDAsync(id);
            if (value is not null)
            {
                valueRepository.Delete(value);
                await valueRepository.SaveAsync();
            }
            else throw new HttpException(Errors.InvalidFilterValueId, HttpStatusCode.BadRequest);
        } 
        
        public async Task EditAsync(int id,string name)
        {
            var value = await valueRepository.GetByIDAsync(id);
            if (value is not null)
            {
                value.Value = name;
                await valueRepository.SaveAsync();
            }
            else throw new HttpException(Errors.InvalidFilterValueId, HttpStatusCode.BadRequest);
        }

        public async Task RemoveRangeAsync(IEnumerable<int> ids)
        {
            var values = await GetByIdsAsync(ids);
            if (values is not null && values.Any())
            {
                await valueRepository.AddRangeAsync(values);
                await valueRepository.SaveAsync();
            }
            else throw new HttpException(Errors.InvalidFilterValueId, HttpStatusCode.BadRequest);
        }
    }
}
