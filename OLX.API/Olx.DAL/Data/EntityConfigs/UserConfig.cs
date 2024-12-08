using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities;


namespace Olx.DAL.Data.EntityConfigs
{
    public class UserConfig : IEntityTypeConfiguration<OlxUser>
    {
        public void Configure(EntityTypeBuilder<OlxUser> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasMany(x => x.Adverts)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);
            builder.HasMany(x => x.FavoriteAdverts)
                .WithMany(x => x.FavoritedByUsers)
                .UsingEntity(x => x.ToTable("UserFavorites"));
        }
    }
}
