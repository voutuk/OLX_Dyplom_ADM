using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Models.User;


namespace OLX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(IAccountService accountService, IConfiguration configuration) : ControllerBase
    {
        private readonly string _refreshTokenCookiesName = configuration["RefreshTokenCookiesName"]!;

        [Authorize(Roles = Roles.User)]
        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites()
        {
            var favorites = await accountService.GetFavoritesAsync();
            return Ok(favorites);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest model )
        {
            var authResponse = await accountService.LoginAsync(model);
            SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [HttpPost("login/google")]
        public async Task<IActionResult> GoogleLogin([FromBody] string googleAccessToken)
        {
            var authResponse = await accountService.GoogleLoginAsync(googleAccessToken);
            SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [Authorize]
        [HttpPost("user/logout")]
        public async Task<IActionResult> LogOut([FromBody] string? refreshToken)
        {
            if (Request.Cookies.TryGetValue(_refreshTokenCookiesName, out var token))
            {
                await accountService.LogoutAsync(token);
            }
            else if (refreshToken is not null)
            {
                await accountService.LogoutAsync(refreshToken);
            }
            else return Unauthorized();
            Response.Cookies.Delete(_refreshTokenCookiesName);
            return Ok();
        }

        [HttpPost("user/refresh")]
        public async Task<IActionResult> RefreshTokens([FromBody] string? refreshToken)
        {
            string token;
            if (Request.Cookies.TryGetValue(_refreshTokenCookiesName, out var httpToken))
            {
                token = httpToken;
            }
            else if (refreshToken is not null)
            {
                token = refreshToken;
            }
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

        [HttpPost("password/reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel resetPasswordModel)
        {
            await accountService.ResetPasswordAsync(resetPasswordModel);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("edit/user")]
        public async Task<IActionResult> EditUser([FromForm] UserEditModel userEditModel)
        {
            await accountService.EditUserAsync(userEditModel);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("edit/admin")]
        public async Task<IActionResult> EditAdmin([FromForm] UserEditModel userEditModel)
        {
            await accountService.EditUserAsync(userEditModel,true);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] UserBlockModel userBlockModel)
        {
            await accountService.BlockUserAsync(userBlockModel);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("favorites/add/{advertId:int}")]
        public async Task<IActionResult> AddToFavorites([FromRoute] int advertId)
        {
            await accountService.AddToFavoritesAsync(advertId);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("register/admin")]
        public async Task<IActionResult> AddAdmin([FromForm] UserCreationModel adminModel)
        {
            await accountService.AddUserAsync(adminModel,true);
            return Ok();
        }

        [HttpPut("register/user")]
        public async Task<IActionResult> AddUser([FromForm] UserCreationModel userModel)
        {
            await accountService.AddUserAsync(userModel);
            return Ok();
        }
        
        [Authorize(Roles = Roles.User)]
        [HttpDelete("favorites/remove/{advertId:int}")]
        public async Task<IActionResult> RemoveFromFavorites([FromRoute] int advertId)
        {
            await accountService.RemoveFromFavoritesAsync(advertId);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete")]
        public async Task<IActionResult> RemoveAccount([FromQuery] string email)
        {
            await accountService.RemoveAccountAsync(email);
            return Ok();
        }

        private void SetHttpOnlyCookies(string token)
        {
            Response.Cookies.Append(_refreshTokenCookiesName, token, new CookieOptions
            {
                HttpOnly = true,
                // Domain = "olx.com",
                // Secure = true,
                Path = "/api/Account/user",
                Expires = DateTime.Now.AddDays(double.Parse(configuration["JwtOptions:RefreshTokenLifeTimeInDays"]!))
            });
        }
    }
}
