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
                Query.Include(x=>x.Parent)
                     .Include(x=>x.Childs)
                     .Include(x=>x.Filters)
                     .AsTracking(tracking);
            }
        }

        public class GetMain : Specification<Category>
        {
            public GetMain(bool tracking = false)
            {
                Query.Where(x=>x.Parent == null)
                     .Include(x => x.Parent)
                     .Include(x => x.Childs)
                     .Include(x => x.Filters)
                     .AsTracking(tracking);
            }
        }
    }
}
