using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Olx.BLL.Entities;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Specifications;
using OLX.API.Models.Seeder;
using System;
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
                       await roleManager.CreateAsync(new IdentityRole<int>{ Name = role });
                }
            }

            //Users seeder
            var userManager = serviceProvider.GetRequiredService<UserManager<OlxUser>>();
            var imageService = serviceProvider.GetRequiredService<IImageService>();
            if (!userManager.Users.Any())
            {
                Console.WriteLine("Start users seeder");
                string usersJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!,"Users.json" );
                if (File.Exists(usersJsonDataFile))
                {
                    var userJson = File.ReadAllText(usersJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var usersData = JsonConvert.DeserializeObject<IEnumerable<SeederUserModel>>(userJson)
                            ?? throw new JsonException();
                        foreach (var user in usersData)
                        {
                            var newUser = new OlxUser
                            {
                                UserName = user.Email,
                                Email = user.Email,
                                PhoneNumber = user.PhoneNumber,
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Photo = user.PhotoBase64 is not null
                                ? await imageService.SaveImageAsync(user.PhotoBase64)
                                : await imageService.SaveImageFromUrlAsync(user.PhotoUrl ?? "https://picsum.photos/800/600"),
                                WebSite = user.WebSite,
                                About = user.About,
                                EmailConfirmed = true
                            };

                            var result = await userManager.CreateAsync(newUser, user.Password);
                            if (result.Succeeded)
                                await userManager.AddToRoleAsync(newUser, user.Role);
                            else
                                Console.WriteLine($"Error create user \"{user.Email}\"");
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize users json file");
                    }
                }
                else Console.WriteLine("File \"JsonData/Users.json\" not found");  
            }
            //Filter seeder
            var filterRepo = scope.ServiceProvider.GetService<IRepository<Filter>>();
            if (filterRepo is not null && !await filterRepo.AnyAsync() )
            {
                Console.WriteLine("Start filters seeder");
                string filtersJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!, "Filters.json");
                if (File.Exists(filtersJsonDataFile))
                {
                    var filtersJson = File.ReadAllText(filtersJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var filtersModels = JsonConvert.DeserializeObject<IEnumerable<SeederFilterModel>>(filtersJson)
                            ?? throw new JsonException();
                        if (filtersModels.Any())
                        {
                            var filters = filtersModels.Select(x=> new Filter() 
                            { 
                                Name = x.Name,
                                Values = x.Values.Select(z=> new FilterValue() { Value = z}).ToList()
                            });
                            await filterRepo.AddRangeAsync(filters);
                            await filterRepo.SaveAsync();
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize filters json file");
                    }
                }
                else Console.WriteLine("File \"JsonData/Filter.json\" not found");
            }
            //Category seeder
            var categoryRepo = scope.ServiceProvider.GetService<IRepository<Category>>();
            if (categoryRepo is not null && !await categoryRepo.AnyAsync())
            {
                Console.WriteLine("Start categories seeder");
                string categoryJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!,"Categories.json");
                if (File.Exists(categoryJsonDataFile))
                {
                    var filtersJson = File.ReadAllText(categoryJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var categoryModels = JsonConvert.DeserializeObject<IEnumerable<SeederCategoryModel>>(filtersJson)
                            ?? throw new JsonException();
                        if (categoryModels.Any() && filterRepo is not null)
                        {
                            var filters = await filterRepo.GetListBySpec(new FilterSpecs.GetAll());
                            await categoryRepo.AddRangeAsync(await GetCategories(categoryModels, filters,imageService));
                            await categoryRepo.SaveAsync();
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize categories json file");
                    }
                }
                else Console.WriteLine("File \"JsonData/Categories.json\" not found");
            }
            //Advert seeder
            var filterValueRepo = scope.ServiceProvider.GetService<IRepository<FilterValue>>();
            var advertRepo = scope.ServiceProvider.GetService<IRepository<Advert>>();
            if (advertRepo is not null && !await advertRepo.AnyAsync())
            {
                Console.WriteLine("Start adverts seeder");
                string advertsJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!, "Adverts.json");
                if (File.Exists(advertsJsonDataFile))
                {
                    var advertsJson = File.ReadAllText(advertsJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var advertModels = JsonConvert.DeserializeObject<IEnumerable<SeederAdvertModel>>(advertsJson)
                            ?? throw new JsonException();
                        if (advertModels.Any())
                        {
                            var adverts = advertModels.Select(x => new Advert()
                            {
                                UserId = x.UserId,
                                PhoneNumber = x.PhoneNumber,
                                ContactEmail = x.ContactEmail,
                                ContactPersone = x.ContactPersone,
                                Title = x.Title,
                                Description = x.Description,
                                IsContractPrice = x.IsContractPrice,
                                Price = x.Price,
                                CategoryId = x.CategoryId,
                                FilterValues = x.FilterValueIds.Select(id =>
                                {
                                    var filterValue = filterValueRepo.GetByIDAsync(id).Result;
                                    if (filterValue == null)
                                    {
                                        throw new InvalidOperationException($"FilterValue with Id {id} not found.");
                                    }
                                    return filterValue;
                                }).ToList(),
                                Images = x.ImagePaths.Select((path, index) => new AdvertImage()
                                {
                                    Priority = index,
                                    Name = path
                                }).ToList()
                            });
                            Console.WriteLine($"Adding {adverts.Count()} adverts to the database.");
                            await advertRepo.AddRangeAsync(adverts);
                            await advertRepo.SaveAsync();
                            Console.WriteLine("Adverts added to the database.");
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize adverts json file");
                    }
                }
                else Console.WriteLine("File \"Adverts.json\" not found");
            }
        }

        private async static Task<IEnumerable<Category>> GetCategories(IEnumerable<SeederCategoryModel> models,IEnumerable<Filter> filters,IImageService imageService)
        {
            List<Category> categories = [];
            foreach (var model in models)
            {
                var category = new Category()
                {
                    Name = model.Name,
                    Image = !String.IsNullOrEmpty(model.Image) ? await imageService.SaveImageFromUrlAsync(model.Image) : null
                };

                if (model.Filters?.Any() ?? false)
                {
                    category.Filters = filters.Where(x => model.Filters.Contains(x.Name)).ToList();
                }

                if (model.Childs?.Any() ?? false)
                {
                    var childs = await GetCategories(model.Childs, filters, imageService);
                    category.Childs = childs.ToList();
                }
                categories.Add(category);
            }
            return categories;
        }
    }
}
