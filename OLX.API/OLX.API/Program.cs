using Microsoft.AspNetCore.CookiePolicy;
using Olx.BLL.Exstensions;
using Olx.DAL.Exstension;
using OLX.API.Extensions;
using OLX.API.Middlewares;
using System.Globalization;
using System.Net;

var defaultCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOlxDbContext(builder.Configuration);
builder.Services.AddOlxBLLServices(builder.Configuration);
builder.Services.AddOlxApiConfigurations(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//if (builder.Environment.IsDevelopment())
//{
//    builder.WebHost.ConfigureKestrel(options =>
//    {
//        options.Listen(IPAddress.Any, 5005, listenOptions =>
//        {
//            listenOptions.UseHttps(); // Використовуємо HTTPS тільки в розробці
//        });
//    });
//}

var app = builder.Build();
app.UseCors("AllowOrigins");
app.AddStaticFiles();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    // При включении HTTPS нужно вернуть CookieSecurePolicy.Always
    Secure = CookieSecurePolicy.None,
    
});
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapControllers();
app.DataBaseMigrate();
await app.SeedDataAsync();
await app.RunAsync();
