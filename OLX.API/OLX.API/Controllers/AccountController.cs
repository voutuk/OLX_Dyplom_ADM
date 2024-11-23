using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Models.Authentication;

namespace OLX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(IAccountService accountService, IConfiguration configuration) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest model )
        {
            var authResponse = await accountService.LoginAsync(model);
            SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut([FromBody] string? refreshToken)
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token))
                await accountService.LogoutAsync(token);
            else if (refreshToken is not null)
                await accountService.LogoutAsync(refreshToken);
            else return Unauthorized();
            Response.Cookies.Delete(configuration["RefreshTokenCookiesName"]!);
            return Ok();
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshTokens([FromBody] string? refreshToken)
        {
            string token;
            if (Request.Cookies.TryGetValue("refreshToken", out var httpToken))
                token = httpToken;
            else if (refreshToken is not null)
                token = refreshToken;
            else return Unauthorized();
            var authResponse = await accountService.RefreshTokensAsync(token);
            SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [HttpPost("email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] EmailConfirmationModel confirmationModel)
        {
            await accountService.EmailConfirmAsync(confirmationModel);
            return Ok();
        }

        [HttpPost("password")]
        public async Task<IActionResult> FogotPassword([FromQuery] string email)
        {
            await accountService.FogotPasswordAsync(email);
            return Ok();
        }

        private void SetHttpOnlyCookies(string token)
        {
            Response.Cookies.Append(configuration["RefreshTokenCookiesName"]!, token, new CookieOptions
            {
                HttpOnly = true,
                // Domain = "olx.com",
                // Secure = true,
                // Path = "/"
                Expires = DateTime.Now.AddDays(double.Parse(configuration["JwtOptions:RefreshTokenLifeTimeInDays"]!))
            });
        }
    }
}
