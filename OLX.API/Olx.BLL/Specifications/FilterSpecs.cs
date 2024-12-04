using Ardalis.Specification;
using Olx.BLL.Entities.FilterEntities;


namespace Olx.BLL.Specifications
{
    public static class FilterSpecs
    {
        public class GetByIds : Specification<Filter>
        {
            public GetByIds(IEnumerable<int> ids, bool tracking = false) =>
                Query.Where(x => ids.Contains(x.Id))
                     .Include(x => x.Values)
                     .AsTracking(tracking);
        }
        public class GetAll : Specification<Filter>
        {
            public GetAll( bool tracking = false) =>
                Query.Include(x => x.Values)
                     .AsTracking(tracking);
        }
        public class GetByNames : Specification<Filter>
        {
            public GetByNames(IEnumerable<string> names, bool tracking = false) =>
                Query.Where(x=>names.Contains(x.Name))
                     .Include(x => x.Values)
                     .AsTracking(tracking);
        }
        public class GetById : Specification<Filter>
        {
            public GetById(int id,bool tracking = false) =>
                Query.Where(x=>x.Id == id)
                .Include(x=>x.Values)
                .AsTracking(tracking);
        }
    }
}
