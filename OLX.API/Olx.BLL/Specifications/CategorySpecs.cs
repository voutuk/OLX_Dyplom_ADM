using Ardalis.Specification;
using Olx.BLL.Entities;


namespace Olx.BLL.Specifications
{
    public static class CategorySpecs
    {
        private static void Include(ISpecificationBuilder<Category> query, CategoryOpt? options)
        {
            if (options is not null)
            {
                foreach (CategoryOpt option in Enum.GetValues(typeof(CategoryOpt)))
                {
                    if (options.Value.HasFlag(option))
                    {
                        _ = option switch
                        {
                           CategoryOpt.Parent => query.Include(x => x.Parent),
                           CategoryOpt.NoTracking => query.AsNoTracking(),
                           CategoryOpt.Childs => query.Include(x => x.Childs),
                           CategoryOpt.Filters => query.Include(x => x.Adverts),
                           CategoryOpt.Image => query.Include(x => x.Image),
                            _ => query
                        };
                    }
                }
            }
        }
        public class GetAll : Specification<Category>
        {
            public GetAll(CategoryOpt? options = null) 
            {
                Include(Query, options);
            }
        }

        public class GetMain : Specification<Category>
        {
            public GetMain(CategoryOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x => x.Parent == null);
            }
        }
        public class GetById : Specification<Category>
        {
            public GetById(int id,CategoryOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x => x.Id == id);
            }
        }
    }
}
