using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Olx.BLL.Entities;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using OLX.API.Models;
using System.Text;

namespace OLX.API.Extensions
{
    public static class DBSeeder
    {
        public static async Task SeedDataAsync(this WebApplication app)
        {
            //Roles seeder
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var roles = Roles.Get();
            if (roleManager.Roles.Count() < roles.Count())
            {
                foreach (var role in roles) {
                    if (! await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole<int>{ Name = role });
                    }
                }
            }

            //Users seeder
            var userManager = serviceProvider.GetRequiredService<UserManager<OlxUser>>();
            if(!userManager.Users.Any())
            {
                string userJsonDataFile = Path.Combine(Directory.GetCurrentDirectory(),"JsonData/Users.json" );  
                var userJson = File.ReadAllText(userJsonDataFile, Encoding.UTF8);
                var usersData = JsonConvert.DeserializeObject<IEnumerable<SeaderUserModel>>(userJson)!;
                var imageService = serviceProvider.GetRequiredService<IImageService>();
                foreach (var user in usersData) 
                {
                    var newUser = new OlxUser()
                    {
                        UserName = user.Email,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    };

                    string? userImageData = user.ImageBase64 ?? user.ImageUrl;
                    newUser.Image = userImageData is not null
                        ? await imageService.SaveImageAsync(userImageData)
                        : await imageService.SaveImageFromUrlAsync("https://picsum.photos/800/600");
                              
                    var result = await userManager.CreateAsync(newUser,user.Password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newUser, Roles.Admin);
                    }
                    else
                    {
                        Console.WriteLine($"Error create user \"{user.Email}\"");
                    }
                }
            }
        }
    }
}
