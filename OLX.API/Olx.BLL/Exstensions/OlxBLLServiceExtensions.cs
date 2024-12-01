using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NETCore.MailKit.Extensions;
using NETCore.MailKit.Infrastructure.Internal;
using Olx.BLL.Exceptions;
using Olx.BLL.Helpers.Options;
using Olx.BLL.Interfaces;
using Olx.BLL.Resources;
using Olx.BLL.Services;
using System.Net;


namespace Olx.BLL.Exstensions
{
    public static class OlxBLLServiceExtensions
    {
        public static void AddOlxBLLServices(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IFilterValueService, FilterValueService>();
            services.AddScoped<IFilterService, FilterService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddHostedService<TokenCleanupService>();

            services.AddMailKit(optionBuilder =>
            {
                MailSettings? settings = configuration.GetSection(nameof(MailSettings)).Get<MailSettings>()
                ?? throw new HttpException(Errors.JwtSettingsReadError, HttpStatusCode.InternalServerError);
                optionBuilder.UseMailKit(new MailKitOptions()
                {
                    Server = settings.Server,
                    Port = settings.Port,
                    SenderName = settings.SenderName,
                    SenderEmail = settings.SenderEmail,
                    Account = settings.Account,
                    Password = settings.Password,
                    Security = true
                });
            });
        }
    }
}
