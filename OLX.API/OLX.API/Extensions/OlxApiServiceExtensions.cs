using Microsoft.Extensions.FileProviders;
using Olx.BLL.Exstensions;
using Olx.DAL.Exstension;
using OLX.API.Helpers.CustomJsonConverters;


namespace OLX.API.Extensions
{
    public static class OlxApiServiceExtensions
    {
        public static void AddOlxApiServicesAndConfigurations(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddOlxDALConfigurations(configuration);
            services.AddOlxBLLServices();

            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new FlexibleDateTimeConverter());
                options.JsonSerializerOptions.Converters.Add(new FlexibleDoubleConverter());
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigins",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });
        }

        /// <summary>
        /// Створення папки для файлів та шлях до файлів
        /// </summary>
        /// <param name="app"></param>
        public static void AddStaticFiles(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            string imagesDir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);
            string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagePath"]!);

            if (!Directory.Exists(imagesDir))
            {
                Directory.CreateDirectory(imagesDir);
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(imagesDir),
                RequestPath = imagesPath
            });

        }
    }
}
