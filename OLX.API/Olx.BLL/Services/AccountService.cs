using Microsoft.AspNetCore.Identity;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Models.User;
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

        public async Task<AuthResponse> LoginAsync(AuthRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            
            if (user != null) 
            {
                if (await _userManager.IsLockedOutAsync(user))
                {
                    throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                    {
                        Message = "Ваш обліковий запис заблокований.",
                        UnlockTime = user.LockoutEnd.HasValue ? user.LockoutEnd.Value.LocalDateTime : null
                    });
                }

                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    //ToDo -=Send user confirmation email=-
                    throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                    {
                        Message = "Ваша пошта не підтверджена. Перевірте email для підтвердження.",
                        UnlockTime = null
                    });
                }

                if (!await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    await _userManager.AccessFailedAsync(user);
                    if (await _userManager.IsLockedOutAsync(user))
                    {
                        throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                        {
                            Message = "Ваш обліковий запис заблоковано через надто багато невірних спроб входу",
                            UnlockTime = user.LockoutEnd.HasValue ? user.LockoutEnd.Value.LocalDateTime : null
                        });
                    }
                }
                else
                {
                    await _userManager.ResetAccessFailedCountAsync(user);
                    return new()
                    {
                        AccessToken = _jwtService.CreateToken(await _jwtService.GetClaimsAsync(user)),
                        RefreshToken = await CreateRefreshToken(user.Id)
                    };
                }    
            }
            throw new HttpException(Errors.InvalidLoginData, HttpStatusCode.BadRequest);
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

    }
}
