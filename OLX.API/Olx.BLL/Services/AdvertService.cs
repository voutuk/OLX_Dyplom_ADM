using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Advert;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Models.Page;

namespace Olx.BLL.Services
{
    public class AdvertService(
        IRepository<Advert> advertRepository,
        IMapper mapper) : IAdvertService
    {
        public Task CreateAsync(AdvertCreationModel advertModel)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AdvertDto>> GetAdvertsAsync(int[] ids)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AdvertDto>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AdvertDto>> GetByEmailAsync(string userEmail)
        {
            throw new NotImplementedException();
        }

        public Task<AdvertDto> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AdvertImageDto>> GetImagesAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<PageResponse<AdvertDto>> GetPageAsync(AdvertPageRequest pageRequest)
        {
            var paginationBuilder = new PaginationBuilder<Advert>(advertRepository);
            var filter = mapper.Map<AdvertFilter>(pageRequest);
            var sortData = new AdvertSortData(pageRequest.IsDescending, pageRequest.SortIndex);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page, pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = mapper.Map<IEnumerable<AdvertDto>>(page.Items)
            };
        }

        public Task UpdateAsync(AdvertCreationModel advertModel)
        {
            throw new NotImplementedException();
        }
    }
}
