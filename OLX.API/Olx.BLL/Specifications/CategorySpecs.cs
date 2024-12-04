using Ardalis.Specification;
using Olx.BLL.Entities;


namespace Olx.BLL.Specifications
{
    public static class CategorySpecs
    {
        public class GetAll : Specification<Category>
        {
            public GetAll(bool tracking = false) 
            {
                Query.AsTracking(tracking)
                     .Include(x=>x.Filters);
            }
        }

        public class GetMain : Specification<Category>
        {
            public GetMain(bool tracking = false)
            {
                Query.AsTracking(tracking)
                     .Include(x => x.Filters)
                     .Where(x => x.Parent == null);
            }
        }
    }
}
