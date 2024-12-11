using Ardalis.Specification;
using Olx.BLL.Entities;


namespace Olx.BLL.Specifications
{
    public static class OlxUserSpecs
    {
        private static void Include(ISpecificationBuilder<OlxUser> query, UserOpt? options)
        {
            if (options is not null)
            {
                foreach (UserOpt option in Enum.GetValues(typeof(UserOpt)))
                {
                    if (options.Value.HasFlag(option))
                    {
                        _ = option switch
                        {
                            UserOpt.RefreshTokens => query.Include(x => x.RefreshTokens),
                            UserOpt.NoTracking => query.AsNoTracking(),
                            UserOpt.Adverts => query.Include(x => x.Adverts),
                            UserOpt.FavoriteAdverts => query.Include(x => x.FavoriteAdverts),
                            UserOpt.ChatMessages => query.Include(x => x.ChatMessages),
                            UserOpt.SellChats => query.Include(x => x.SellChats.Where(z => z.IsDeletedForSeller)),
                            UserOpt.BuyChats => query.Include(x => x.BuyChats.Where(z => z.IsDeletedForBuyer)),
                            _ => query
                        };
                    }
                }
            }
        }
        public class GetByRefreshToken : Specification<OlxUser>
        {
            public GetByRefreshToken(string token, UserOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x => x.RefreshTokens.Any(z => z.Token == token));
            }
                
        }

        public class GetById : Specification<OlxUser>
        {
            public GetById(int id, UserOpt? options = null)
            {
                Include(Query, options);
                Query.Where(x => x.Id == id);
            }
                
        }
    }
}
