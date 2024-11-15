using Microsoft.AspNetCore.Identity;

namespace OLX.API.Extensions
{
    public static class DBSeeder
    {
        public static async Task SeedData(this WebApplication app, IConfiguration config)
        {
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            //Seeder code here
            //  var userManager = serviceProvider.GetRequiredService<UserManager<User>>(); //Get service example
        }
    }
}
