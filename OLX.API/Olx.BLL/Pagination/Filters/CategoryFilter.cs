
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination.Filters
{
    public class CategoryFilter(string? searchName,int parentId) : IPaginationFilter<Category>
    {
        public IQueryable<Category> FilterQuery(IQueryable<Category> query)
        {
            query = query.Include(x => x.Filters);
            if (!String.IsNullOrWhiteSpace(searchName))
            {
                query = query.Where(x => x.Name.ToLower().Contains(searchName.ToLower()));
            }
            if (parentId != 0)
            {
                query = query.Where(x => x.ParentId == parentId);
            }
            return query;
        }
    }
}
