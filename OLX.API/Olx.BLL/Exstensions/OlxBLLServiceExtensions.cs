using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Olx.BLL.Interfaces;
using Olx.BLL.Services;


namespace Olx.BLL.Exstensions
{
    public static class OlxBLLServiceExtensions
    {
        public static void AddOlxBLLServices(this IServiceCollection services)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<IJwtService, JwtService>();
        }
    }
}
