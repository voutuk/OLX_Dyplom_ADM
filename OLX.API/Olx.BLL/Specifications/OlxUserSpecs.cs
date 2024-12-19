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
                        switch(option)
                        {
                            case UserOpt.RefreshTokens: query.Include(x => x.RefreshTokens); break;
                            case UserOpt.NoTracking: query.AsNoTracking(); break;
                            case UserOpt.Adverts: query.Include(x => x.Adverts); break;
                            case UserOpt.FavoriteAdverts: query.Include(x => x.FavoriteAdverts); break;
                            case UserOpt.ChatMessages: query.Include(x => x.ChatMessages); break;
                            case UserOpt.SellChats: query.Include(x => x.SellChats.Where(z => z.IsDeletedForSeller)); break;
                            case UserOpt.BuyChats: query.Include(x => x.BuyChats.Where(z => z.IsDeletedForBuyer)); break;
                            case UserOpt.AdminMessages: query.Include(x => x.AdminMessages.Where(z => !z.Deleted)); break;
                            case UserOpt.Settlement: query.Include(x => x.Settlement); break;
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
