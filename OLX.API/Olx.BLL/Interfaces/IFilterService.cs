using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Models.FilterModels;
using Olx.BLL.Models.Page;
using Olx.BLL.Specifications;


namespace Olx.BLL.Interfaces
{
    public interface IFilterService
    {
        Task<PageResponse<FilterDto>> GetPageAsync(FilterPageRequest pageRequest);
        Task<IEnumerable<FilterDto>> GetAll();
        Task<IEnumerable<Filter>> GetByIds(IEnumerable<int> ids);
        Task<IEnumerable<FilterDto>> GetDtoByIds(IEnumerable<int> ids);
        Task CreateAsync(FilterCreationModel filterModel);
        Task RemoveAsync(int id);
        Task EditAsync(FilterEditModel filterModel);
    }
}
