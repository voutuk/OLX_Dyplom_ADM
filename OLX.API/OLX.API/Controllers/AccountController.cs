using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Authentication;

namespace OLX.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController(IAccountService accountService, IConfiguration configuration) : ControllerBase
    {
        private readonly IAccountService _accountService = accountService;
        private readonly IConfiguration _configuration = configuration;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest model )
        {
            var authResponse = await _accountService.LoginAsync(model);
            SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut([FromBody] string? refreshToken)
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token))
                await _accountService.LogoutAsync(token);
            else if (refreshToken is not null)
                await _accountService.LogoutAsync(refreshToken);
            else return Unauthorized();
            Response.Cookies.Delete(_configuration["RefreshTokenCookiesName"]!);
            return Ok();
        }

        [Authorize]
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshTokens([FromBody] string? refreshToken)
        {
            string token;
            if (Request.Cookies.TryGetValue("refreshToken", out var httpToken))
                token = httpToken;
            else if (refreshToken is not null)
                token = refreshToken;
            else return Unauthorized();
            var authResponse = await _accountService.RefreshTokensAsync(token);
            SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        private void SetHttpOnlyCookies(string token)
        {
            Response.Cookies.Append(_configuration["RefreshTokenCookiesName"]!, token, new CookieOptions
            {
                HttpOnly = true,
                // Secure = true,
                Expires = DateTime.Now.AddDays(double.Parse(_configuration["JwtOptions:RefreshTokenLifeTimeInDays"]!))
            });
        }
    }
}
