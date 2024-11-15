
using Microsoft.Extensions.DependencyInjection;
namespace Olx.DAL.Exstension
{
    public static class OlxDALServiceExtensions
    {
        public static void AddOlxDALServices(this IServiceCollection services)
        {

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
    }
}
