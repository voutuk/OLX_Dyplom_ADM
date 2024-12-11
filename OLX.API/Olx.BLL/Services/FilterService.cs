using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.FilterModels;
using Olx.BLL.Models.Page;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;


namespace Olx.BLL.Services
{
    public class FilterService(
        IRepository<Filter> filterRepository,
        IValidator<FilterCreationModel> filterCreationModelValidator,
        IValidator<FilterEditModel> filterEditModelValidator,
        IMapper mapper,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext) : IFilterService
    {

        public async Task CreateAsync(FilterCreationModel filterModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            filterCreationModelValidator.ValidateAndThrow(filterModel);
            await filterRepository.AddAsync(mapper.Map<Filter>(filterModel));
            await filterRepository.SaveAsync();
        }

        public async Task<IEnumerable<Filter>> GetByIds(IEnumerable<int> ids) =>
            await filterRepository.GetListBySpec(new FilterSpecs.GetByIds(ids, FilterOpt.Values));

        public async Task<IEnumerable<FilterDto>> GetDtoByIds(IEnumerable<int> ids)
        {
            var filters = await filterRepository.GetListBySpec(new FilterSpecs.GetByIds(ids, FilterOpt.Values|FilterOpt.NoTracking));
            return mapper.Map<IEnumerable<FilterDto>>(filters);
        }
            
        public async Task<IEnumerable<FilterDto>> GetAll() =>
            mapper.Map<IEnumerable<FilterDto>>(await filterRepository.GetListBySpec(new FilterSpecs.GetAll(FilterOpt.Values|FilterOpt.NoTracking)));

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

        public async Task EditAsync(FilterEditModel filterModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            filterEditModelValidator.ValidateAndThrow(filterModel);
            var filter = await filterRepository.GetItemBySpec(new FilterSpecs.GetById(filterModel.Id,FilterOpt.Values));
            if (filter is not null)
            {
                mapper.Map(filterModel,filter);
                if (filterModel.OldValueIds is not null && filterModel.OldValueIds.Any())
                {
                    var values = filter.Values.Where(x => filterModel.OldValueIds.Contains(x.Id));
                    filter.Values = values.ToHashSet();
                }
                else filter.Values.Clear();

                if (filterModel.NewValues is not null && filterModel.NewValues.Any())
                {
                    filter.Values = [.. filter.Values, .. filterModel.NewValues.Select(x => new FilterValue() { Value = x })];
                }
                await filterRepository.SaveAsync();
            }
            else throw new HttpException(Errors.InvalidFilterId, HttpStatusCode.BadRequest);
        }

        public async Task<PageResponse<FilterDto>> GetPageAsync(FilterPageRequest pageRequest)
        {
            var paginationBuilder = new PaginationBuilder<Filter>(filterRepository);
            var filter = new FiltersFilter(pageRequest.SearchName);
            var sortData =  new FilterSortData(pageRequest.IsDescending,pageRequest.SortIndex);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page,pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = mapper.Map<IEnumerable<FilterDto>>(page.Items)
            };
        }
    }
}
