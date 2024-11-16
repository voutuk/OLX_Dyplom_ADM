
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities;
using System.Reflection.Emit;
using System.Reflection;

namespace Olx.DAL.Data
{
    public class OlxDbContext (DbContextOptions options) : IdentityDbContext<OlxUser, IdentityRole<int>, int>(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
