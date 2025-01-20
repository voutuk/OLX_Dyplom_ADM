using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;


namespace Olx.BLL.Pagination.SortData
{
    public class CategorySortData(bool descending,string sortKey) : IPaginationSortData<Category>
    {
        public IQueryable<Category> Sort(IQueryable<Category> query)
        {
            Expression<Func<Category, object?>>? sortExpr =
                sortKey switch
                {
                    "id" => x => x.Id,
                    "name" => x => x.Name,
                    "parentId" => x => x.ParentId,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
