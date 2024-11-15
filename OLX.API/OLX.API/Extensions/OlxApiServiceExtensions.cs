using Microsoft.OpenApi.Models;

namespace OLX.API.Extensions
{
    public static class OlxApiServiceExtensions
    {
        public static void AddOlxApiServices(this IServiceCollection services, IConfiguration configuration)
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
