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
        }
    }
}
