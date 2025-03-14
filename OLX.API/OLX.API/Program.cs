using Olx.BLL.Exstensions;
using Olx.BLL.Hubs;
using Olx.DAL.Exstension;
using OLX.API.Extensions;
using OLX.API.Middlewares;
using System.Globalization;

var defaultCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOlxDbContext(builder.Configuration);
builder.Services.AddOlxBLLServices(builder.Configuration);
builder.Services.AddOlxApiConfigurations(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddHealthChecks(); // Adding standard health check

var app = builder.Build();

// Important: UseRouting should come early in the pipeline
app.UseRouting();

app.UseCors("AllowOrigins");
app.AddStaticFiles();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
//app.UseCookiePolicy(new CookiePolicyOptions
//{
//    MinimumSameSitePolicy = SameSiteMode.Strict,
//    HttpOnly = HttpOnlyPolicy.Always,
//    Secure = CookieSecurePolicy.Always,
//});
app.UseAuthentication();
app.UseAuthorization();

// Configure endpoints after middleware that modifies routing
app.UseEndpoints(endpoints =>
{
    endpoints.MapHealthChecks("/healthz");
    endpoints.MapHub<MessageHub>("/hub");
    endpoints.MapControllers();
});

//app.UseHttpsRedirection();
app.AddCultures();
app.DataBaseMigrate();
await app.SeedDataAsync();
await app.RunAsync();