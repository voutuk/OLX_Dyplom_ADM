using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.FileProviders;
using OLX.API.Helpers.CustomJsonConverters;
using Olx.BLL.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;


namespace OLX.API.Extensions
{
    public static class OlxApiServiceExtensions
    {
        /// <summary>
        /// Налаштування контроллерів,JWT,Swagger,CORS
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void AddOlxApiConfigurations(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new FlexibleDateTimeConverter());
                options.JsonSerializerOptions.Converters.Add(new FlexibleDoubleConverter());
            });

            var jwtOpts = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;

           // services.AddScoped<IJwtService, JwtService>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(o =>
                {
                    o.RequireHttpsMetadata = false;
                    o.IncludeErrorDetails = true;
                    o.UseSecurityTokenValidators = true;
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtOpts.Issuer,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOpts.Key)),
                        ClockSkew = TimeSpan.Zero,
                        SaveSigninToken = true,
                    };
                });

            services.AddAuthorization(opts =>
            {
                opts.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                      .RequireAuthenticatedUser().Build();
            });


            var assemblyName = Assembly.GetExecutingAssembly().GetName().Name;
            services.AddSwaggerGen(setup =>
            {
                var fileDoc = Path.Combine(AppContext.BaseDirectory, $"{assemblyName}.xml");
                setup.IncludeXmlComments(fileDoc);
                // Include 'SecurityScheme' to use JWT Authentication
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                setup.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });
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
            string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), configuration["ServerImagePath"]!);

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
