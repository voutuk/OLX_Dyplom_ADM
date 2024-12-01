using AutoMapper;
using FluentValidation;
using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Linq;
using System.Net;



namespace Olx.BLL.Services
{
    public class FilterService(
        IRepository<Filter> filterRepository,
        IValidator<FilterCreationModel> filterCreationModelValidator,
        IFilterValueService filterValueService,
        IMapper mapper) : IFilterService
    {
        public async Task CreateAsync(Filter filter)
        {
            await filterRepository.AddAsync(filter);
            await filterRepository.SaveAsync();
        }
     
        public async Task CreateAsync(string filterName, IEnumerable<string>? values = null)
        {
            var filter = new Filter() { Name = filterName };
            if(values is not null)
               filter.Values = values.Select(x=> new FilterValue() {Value = x }).ToHashSet();
            await CreateAsync(filter);
        }

        public async Task CreateAsync(FilterCreationModel filterModel)
        {
            filterCreationModelValidator.ValidateAndThrow(filterModel);
            Filter filter = new() {Name = filterModel.Name };
            List<FilterValue> values = [];
            if (filterModel.NewValues is not null && filterModel.NewValues.Any())
                values.AddRange(filterModel.NewValues.Select(x => new FilterValue() { Value = x }));
            if (filterModel.ValuesIds is not null && filterModel.ValuesIds.Any())
                values.AddRange((await filterValueService.GetByIdsAsync(filterModel.ValuesIds,true)));
            filter.Values = values;
            await filterRepository.AddAsync(filter);
            await filterRepository.SaveAsync();
        }

        public async Task CreateAsync(IEnumerable<Filter> filters)
        {
            await filterRepository.AddRangeAsync(filters);
            await filterRepository.SaveAsync();
        }

        public async Task<int> CountAsync() => await filterRepository.CountAsync();
       
        public async Task<IEnumerable<Filter>> GetByIds(IEnumerable<int> ids, bool tracking = false) =>
            await filterRepository.GetListBySpec(new FilterSpecs.GetByIds(ids, tracking));

        public async Task<IEnumerable<FilterDto>> GetDtoByIds(IEnumerable<int> ids, bool tracking = false) =>
             mapper.Map<IEnumerable<FilterDto>>(await GetByIds(ids, tracking));
            
        public async Task<bool> IsFiltersAsync() => await filterRepository.AnyAsync();

        public async Task<IEnumerable<FilterDto>> GetAll() =>
            mapper.Map<IEnumerable<FilterDto>>(await filterRepository.GetListBySpec(new FilterSpecs.GetAll()));

        public async Task RemoveAsync(int id)
        {
            var filter = await filterRepository.GetByIDAsync(id);
            if (filter is not null)
            {
                filterRepository.Delete(filter);
                await filterRepository.SaveAsync();
            }
            else throw new HttpException(Errors.InvalidFilterId,HttpStatusCode.BadRequest);
        }

        public async Task EditAsync(FilterCreationModel filterModel)
        {
            var filter = await filterRepository.GetItemBySpec( new FilterSpecs.GetById(filterModel.Id,true));
            if (filter is not null)
            {
                mapper.Map(filterModel,filter);
                if (filterModel.ValuesIds is not null && filterModel.ValuesIds.Any())
                {
                    filter.Values = (await filterValueService.GetByIdsAsync(filterModel.ValuesIds)).ToHashSet();
                }
                
                if (filterModel.NewValues is not null && filterModel.NewValues.Any())
                {
                    filter.Values= [.. filter.Values, .. filterModel.NewValues.Select(x => new FilterValue() { Value = x })];
                }
                await filterRepository.SaveAsync();
            }
            else throw new HttpException(Errors.InvalidFilterId, HttpStatusCode.BadRequest);
        }
    }
}
