
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.DAL.Data.EntityConfigs
{
    public class FilterValueConfig : IEntityTypeConfiguration<FilterValue>
    {
        public void Configure(EntityTypeBuilder<FilterValue> builder)
        {
            builder.HasMany(x => x.Filters)
                .WithMany(x => x.Values);
            builder.HasMany(x => x.Adverts)
                .WithMany(x => x.FilterValues);
        }
    }
}
