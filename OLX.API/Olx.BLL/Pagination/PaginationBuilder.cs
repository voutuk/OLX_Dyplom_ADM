using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination
{
    public class PaginationBuilder<TEntity>(IQueryable<TEntity> query) where TEntity : class
    {
        public async Task<Page<TEntity>> GetPageAsync(int page, int size, IPaginationFilter<TEntity>? filter = null, IPaginationSortData<TEntity>? sortData = null)
        {
            if (filter is not null)
            {
                query = filter.FilterQuery((IQueryable<TEntity>)query);
            }

            var total = await query.CountAsync();
            if (sortData is not null)
            {
                query = sortData.Sort((IQueryable<TEntity>)query);
            }

            query = query.AsNoTracking().Skip((page - 1) * size).Take(size);

            return new()
            {
                Total = total,
                Items = await query.ToArrayAsync()
            };
        }
    }
}
