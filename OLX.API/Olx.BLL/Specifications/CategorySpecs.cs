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
                        switch(option)
                        {
                            case CategoryOpt.Parent:  query.Include(x => x.Parent); break;
                            case CategoryOpt.NoTracking: query.AsNoTracking(); break;
                            case CategoryOpt.Childs:  query.Include(x => x.Childs); break;
                            case CategoryOpt.Filters:  query.Include(x => x.Adverts); break;
                            case CategoryOpt.Image:  query.Include(x => x.Image); break;
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
