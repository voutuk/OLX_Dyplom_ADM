using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;

namespace Olx.BLL.Pagination.SortData
{
    public class FilterSortData(bool descending, int sortIndex) : IPaginationSortData<Filter>
    {
        public IQueryable<Filter> Sort(IQueryable<Filter> query)
        {
            Expression<Func<Filter, object?>>? sortExpr =
                sortIndex switch
                {
                    1 => x => x.Id,
                    2 => x => x.Name,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
