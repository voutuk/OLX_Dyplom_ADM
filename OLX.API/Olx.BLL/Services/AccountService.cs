using Microsoft.AspNetCore.Identity;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;

namespace Olx.BLL.Services
{
    public class AccountService(UserManager<OlxUser> userManager,
        IJwtService jwtService,
        IRepository<RefreshToken> tokenRepository,
        IRepository<OlxUser> userRepository) : IAccountService
    {
        private readonly UserManager<OlxUser> _userManager = userManager;
        private readonly IJwtService _jwtService = jwtService;
        private readonly IRepository<RefreshToken> _tokenRepository = tokenRepository;
        private readonly IRepository<OlxUser> _userRepository  = userRepository;


        private async Task<string> CreateRefreshToken(int userId)
        {
            var refeshToken = _jwtService.GetRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                Token = refeshToken,
                OlxUserId = userId,
                ExpirationDate = DateTime.UtcNow.AddDays(_jwtService.GetRefreshTokenLiveTime())
            };
            await _tokenRepository.AddAsync(refreshTokenEntity);
            await _tokenRepository.SaveAsync();
            return refeshToken;
        }

        private async Task<RefreshToken> CheckRefreshTokenAsync(string refreshToken)
        {
            var token = await _tokenRepository.GetItemBySpec(new RefreshTokenSpecs.GetByValue(refreshToken));
            if (token is not null)
            {
                if (token.ExpirationDate > DateTime.UtcNow)
                   return token;
                await _tokenRepository.DeleteAsync(token.Id);
                await _tokenRepository.SaveAsync();
            }
            throw new HttpException(Errors.InvalidToken, HttpStatusCode.Unauthorized);
        }


        public async Task<AuthResponse> LoginAsync(AuthRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                throw new HttpException(Errors.InvalidLoginData, HttpStatusCode.BadRequest);

            return new()
            {
                AccessToken = _jwtService.CreateToken(await _jwtService.GetClaimsAsync(user)),
                RefreshToken = await CreateRefreshToken(user.Id)
            };
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var token = await CheckRefreshTokenAsync(refreshToken);
            await _tokenRepository.DeleteAsync(token.Id);
            await _tokenRepository.SaveAsync();
        }

        public async Task<AuthResponse> RefreshTokensAsync(string refreshToken)
        {
            var token = await CheckRefreshTokenAsync(refreshToken);
            var user = await _userRepository.GetItemBySpec(new OlxUserSpecs.GetByRefreshToken(token.Token)) 
                ?? throw new HttpException(Errors.InvalidToken,HttpStatusCode.Unauthorized);
            await _tokenRepository.DeleteAsync(token.Id);
            return new()
            {
                AccessToken = _jwtService.CreateToken(await _jwtService.GetClaimsAsync(user)),
                RefreshToken = await CreateRefreshToken(user.Id)
            };
        }
    }
}
