
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;

namespace Olx.DAL.Data
{
    public class OlxDbContext(IConfiguration configuration) : IdentityDbContext<OlxUser, IdentityRole<int>, int>
    {
        private readonly IConfiguration _configuration = configuration;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection")!;
            optionsBuilder.UseNpgsql(connectionString);
        }
    }
}
