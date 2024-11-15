using Microsoft.AspNetCore.Identity;

namespace OLX.API.Extensions
{
    public static class DBSeeder
    {
        public static async Task SeedDataAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            //Seeder code here
            //  var config = serviceProvider.GetRequiredService<IConfiguration>(); //Get service example
            //  var userManager = serviceProvider.GetRequiredService<UserManager<User>>(); //Get service example
        }
    }
}
