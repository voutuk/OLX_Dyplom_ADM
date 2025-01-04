using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;


namespace Olx.BLL.Pagination.SortData
{
    public class CategorySortData(bool descending,int sortIndex) : IPaginationSortData<Category>
    {
        public IQueryable<Category> Sort(IQueryable<Category> query)
        {
            Expression<Func<Category, object?>>? sortExpr =
                sortIndex switch
                {
                    1 => x => x.Id,
                    2 => x => x.Name,
                    3 => x => x.ParentId,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
