using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Interfaces;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination
{
    public class PaginationBuilder<TEntity>(IRepository<TEntity> repository) where TEntity : class
    {
        public async Task<Page<TEntity>> GetPageAsync(int page, int size, IPaginationFilter<TEntity>? filter = null, IPaginationSortData<TEntity>? sortData = null)
        {
            var query = repository.GetQuery();
            if (filter is not null)
            {
                query = filter.FilterQuery(query);
            }

            var total = await query.CountAsync();
            if (sortData is not null)
            {
                query = sortData.Sort(query);
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
