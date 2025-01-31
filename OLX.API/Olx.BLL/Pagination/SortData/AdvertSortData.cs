using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;


namespace Olx.BLL.Pagination.SortData
{
    public class AdvertSortData (bool descending,string sortKey) : IPaginationSortData<Advert>
    {
        public IQueryable<Advert> Sort(IQueryable<Advert> query)
        {
            Expression<Func<Advert, object?>>? sortExpr =
                sortKey switch
                {
                    "id" => x => x.Id,
                    "price" => x => x.Price,
                    "date" => x => x.Date,
                    "categoryName" => x => x.Category.Name,
                    "phoneNumber" => x => x.PhoneNumber,
                    "contactEmail" => x => x.ContactEmail,
                    "settlementName" => x => x.Settlement.Description,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
