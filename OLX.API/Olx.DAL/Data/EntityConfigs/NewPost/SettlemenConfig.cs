using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.NewPost;


namespace Olx.DAL.Data.EntityConfigs.NewPost
{
    public class SettlementConfig : IEntityTypeConfiguration<Settlement>
    {
        public void Configure(EntityTypeBuilder<Settlement> builder)
        {
            builder.HasMany(x => x.Warehous)
                .WithOne(x => x.Settlement)
                .HasForeignKey(x => x.SettlementRef);
            builder.HasMany(x => x.Adverts)
               .WithOne(x => x.Settlement)
               .HasForeignKey(x => x.SettlementRef);
        }
    }
}
