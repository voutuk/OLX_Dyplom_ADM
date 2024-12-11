using Ardalis.Specification;
using Olx.BLL.Entities;



namespace Olx.BLL.Specifications
{
    public static class AdvertSpecs
    {
        private static void Include(ISpecificationBuilder<Advert> query, AdvertOpt? options)
        {
            if (options is not null)
            {
                foreach (AdvertOpt option in Enum.GetValues(typeof(AdvertOpt)))
                {
                    if (options.Value.HasFlag(option))
                    {
                        _ = option switch
                        {
                            AdvertOpt.Images => query.Include(x => x.Images),
                            AdvertOpt.NoTracking => query.AsNoTracking(),
                            AdvertOpt.FilterValues => query.Include(x => x.FilterValues),
                            AdvertOpt.Category => query.Include(x => x.Category),
                            AdvertOpt.User => query.Include(x => x.User),
                            AdvertOpt.FavoritedByUsers => query.Include(x => x.FavoritedByUsers),
                            AdvertOpt.Chats => query.Include(x => x.Chats),
                            _ => query
                        };
                    }
                }
            }
        }

        public class GetByIds : Specification<Advert>
        {
            public GetByIds(IEnumerable<int> ids, AdvertOpt? options = null)
            {
                Include(Query,options);
                Query.Where(x=> ids.Contains(x.Id));
            }
        }

        public class GetUserAdvertById : Specification<Advert>
        {
            public GetUserAdvertById(int userId,int advertId, AdvertOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x =>x.UserId == userId && x.Id == advertId);
            }
        }

        public class GetAll : Specification<Advert>
        {
            public GetAll(AdvertOpt? options = null)
            {
                Include(Query, options);
            }
        }
        public class GetByUserId : Specification<Advert>
        {
            public GetByUserId(int userId, AdvertOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x => x.UserId == userId);
            }
        }

        public class GetById : Specification<Advert>
        {
            public GetById(int id, AdvertOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x => x.UserId == id);
            }
        }
    }
}
