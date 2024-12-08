using Ardalis.Specification;
using Olx.BLL.Entities;

namespace Olx.BLL.Specifications
{
    public static class OlxUserSpecs
    {
        public class GetByRefreshToken : Specification<OlxUser>
        {
            public GetByRefreshToken(string token, bool tracking = false) => 
                Query.Include(x=>x.RefreshTokens)
                .Where(x => x.RefreshTokens.Any(z => z.Token == token))
                .AsTracking(tracking);
        }

        public class GetById : Specification<OlxUser>
        {
            public GetById(int id, bool tracking = false) =>
                Query.Include(x => x.FavoriteAdverts)
                .Where(x => x.Id == id)
                .AsTracking(tracking);
        }
    }
}
