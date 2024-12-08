using Ardalis.Specification;
using Olx.BLL.Entities;


namespace Olx.BLL.Specifications
{
    public static class AdvertSpecs
    {
        public class GetByIds : Specification<Advert>
        {
            public GetByIds(IEnumerable<int> ids, bool tracking = false)
            {
                Query.Include(x => x.FilterValues)
                    .Include(x => x.Images)
                    .AsTracking(tracking)
                    .Where(x=> ids.Contains(x.Id));
            }
        }

        public class GetUserAdvertById : Specification<Advert>
        {
            public GetUserAdvertById(int userId,int advertId, bool tracking = false)
            {
                Query.AsTracking(tracking)
                    .Include(x=>x.Images)
                    .Where(x =>x.UserId == userId && x.Id == advertId);
            }
        }

        public class GetAll : Specification<Advert>
        {
            public GetAll( bool tracking = false)
            {
                Query
                    .Include(x=>x.FilterValues)
                    .Include(x=>x.Images)
                    .AsTracking(tracking);
            }
        }
        public class GetByUserId : Specification<Advert>
        {
            public GetByUserId(int userId, bool tracking = false)
            {
                Query.AsTracking(tracking)
                    .Include(x => x.FilterValues)
                    .Include(x => x.Images)
                    .Where(x => x.UserId == userId);
            }
        }

        public class GetById : Specification<Advert>
        {
            public GetById(int id, bool tracking = false)
            {
                Query.AsTracking(tracking)
                    .Include(x=>x.Images)
                    .Where(x => x.UserId == id);
            }
        }

        public class GetFavoritesByUserId : Specification<Advert>
        {
            public GetFavoritesByUserId(int userId, bool tracking = false)
            {
                Query.AsTracking(tracking)
                    .Include(x => x.Images)
                    .Where(x => x.FavoritedByUsers.Any(user => user.Id == userId));
            }
        }

        public class GetFavoriteAdvertByUserIdAndAdvertId : Specification<Advert>
        {
            public GetFavoriteAdvertByUserIdAndAdvertId(int userId, int advertId, bool tracking = false)
            {
                Query.AsTracking(tracking)
                     .Include(a => a.FavoritedByUsers)
                     .Where(a => a.Id == advertId && a.FavoritedByUsers.Any(u => u.Id == userId));
            }
        }
    }
}
