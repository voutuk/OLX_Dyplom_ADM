using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;


namespace Olx.BLL.Pagination.SortData
{
    public class AdvertSortData (bool descending,int sortIndex) : IPaginationSortData<Advert>
    {
        public IQueryable<Advert> Sort(IQueryable<Advert> query)
        {
            Expression<Func<Advert, object?>>? sortExpr =
                sortIndex switch
                {
                    1 => x => x.Id,
                    2 => x => x.Price,
                    3 => x => x.Date,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
