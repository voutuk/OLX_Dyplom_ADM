using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using NETCore.MailKit.Core;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Helpers.Email;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Models.User;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using Olx.BLL.Validators;
using System.Net;


namespace Olx.BLL.Services
{
    public class AccountService(UserManager<OlxUser> userManager,
        IJwtService jwtService,
        IRepository<RefreshToken> tokenRepository,
        IRepository<OlxUser> _userRepository,
        IEmailService emailService,
        IConfiguration configuration,
        IValidator<ResetPasswordModel> resetPasswordModelValidator,
        IValidator<EmailConfirmationModel> emailConfirmationModelValidator,
        IValidator<UserBlockModel> userBlockModelValidator) : IAccountService
    {
        public async Task<AuthResponse> LoginAsync(AuthRequest model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null) 
            {
                if (await userManager.IsLockedOutAsync(user))
                {
                    throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                    {
                        Message = "Ваш обліковий запис заблокований.",
                        UnlockTime = user.LockoutEnd.HasValue && user.LockoutEnd.Value != DateTimeOffset.MaxValue ? user.LockoutEnd.Value.LocalDateTime : null
                    });
                }

                if (!await userManager.IsEmailConfirmedAsync(user))
                {
                    var confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    var email = EmailTemplates.GetEmailConfirmationTemplate(configuration["FrontendEmailConfirmationUrl"]!, confirmationToken,user.Email!);
                    await emailService.SendAsync("Kovalchuk.Olex@gmail.com", "Підтвердження електронної пошти", email, true);
                    throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                    {
                        Message = "Ваша пошта не підтверджена. Перевірте email для підтвердження.",
                        UnlockTime = null
                    });
                }

                if (!await userManager.CheckPasswordAsync(user, model.Password))
                {
                    await userManager.AccessFailedAsync(user);
                    if (await userManager.IsLockedOutAsync(user))
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
                    await userManager.ResetAccessFailedCountAsync(user);
                    return new()
                    {
                        AccessToken = jwtService.CreateToken(await jwtService.GetClaimsAsync(user)),
                        RefreshToken = await CreateRefreshToken(user.Id)
                    };
                }    
            }
            throw new HttpException(Errors.InvalidLoginData, HttpStatusCode.BadRequest);
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var token = await CheckRefreshTokenAsync(refreshToken);
            await tokenRepository.DeleteAsync(token.Id);
            await tokenRepository.SaveAsync();
        }

        public async Task<AuthResponse> RefreshTokensAsync(string refreshToken)
        {
            var token = await CheckRefreshTokenAsync(refreshToken);
            var user = await _userRepository.GetItemBySpec(new OlxUserSpecs.GetByRefreshToken(token.Token)) 
                ?? throw new HttpException(Errors.InvalidToken,HttpStatusCode.Unauthorized);
            await tokenRepository.DeleteAsync(token.Id);
            return new()
            {
                AccessToken = jwtService.CreateToken(await jwtService.GetClaimsAsync(user)),
                RefreshToken = await CreateRefreshToken(user.Id)
            };
        }

        public async Task EmailConfirmAsync(EmailConfirmationModel confirmationModel)
        {
            emailConfirmationModelValidator.ValidateAndThrow(confirmationModel);
            var user = await userManager.FindByEmailAsync(confirmationModel.Email);
            if (user != null)
            {
                var result = await userManager.ConfirmEmailAsync(user, confirmationModel.Token);
                if (result.Succeeded)
                {
                    var mail = EmailTemplates.GetEmailConfirmedTemplate(configuration["FrontendLoginUrl"]!);
                    await emailService.SendAsync("Kovalchuk.Olex@gmail.com", "Електронна пошта підтверджена", mail, true);
                    return;
                }
            }
            throw new HttpException(Errors.InvalidConfirmationData, HttpStatusCode.BadRequest);
        }

        public async Task FogotPasswordAsync(string email) 
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user is not null) 
            {
                var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                var mail = EmailTemplates.GetPasswordResetTemplate(configuration["FrontendResetPasswordUrl"]!, passwordResetToken,user.Email!);
                await emailService.SendAsync("Kovalchuk.Olex@gmail.com", "Скидання пароля", mail, true);
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordModel resetPasswordModel)
        {
            resetPasswordModelValidator.ValidateAndThrow(resetPasswordModel);
            var user = await userManager.FindByEmailAsync(resetPasswordModel.Email);
            if (user is not null)
            {
                var result = await userManager.ResetPasswordAsync(user,resetPasswordModel.Token,resetPasswordModel.Password);
                if (result.Succeeded) return;
            }
            throw new HttpException(Errors.InvalidReserPasswordData, HttpStatusCode.BadRequest);
        }
        public async Task BlockUserAsync(UserBlockModel userBlockModel)
        {
            userBlockModelValidator.ValidateAndThrow(userBlockModel);
            var user = await userManager.FindByEmailAsync(userBlockModel.Email);
            if (user is not null)
            {
                var result = userBlockModel.Block
                    ? await userManager.SetLockoutEndDateAsync(user, userBlockModel.LockoutEndDate ?? DateTimeOffset.MaxValue)
                    : await userManager.SetLockoutEndDateAsync(user, null);
                if (result.Succeeded)
                {
                    if (userBlockModel.Block)
                    {
                        string lockoutEndMessage = userBlockModel.LockoutEndDate is null
                            ? "На невизначений термін"
                            : $"Заблокований до {userBlockModel.LockoutEndDate.Value.ToLongDateString()} {userBlockModel.LockoutEndDate.Value.ToLongTimeString()}";
                        var accountBlockedTemplate = EmailTemplates.GetAccountBlockedTemplate(userBlockModel.BlockReason ?? "", lockoutEndMessage);
                        await emailService.SendAsync("Kovalchuk.olex@gmail.com", "Ваш акаунт заблоковано", accountBlockedTemplate, true);
                    }
                    else
                    {
                        var accountUnblockedTemplate = EmailTemplates.GetAccountUnblockedTemplate();
                        await emailService.SendAsync("Kovalchuk.olex@gmail.com", "Ваш акаунт розблоковано", accountUnblockedTemplate, true);
                    }
                    return;
                } 
            }
            throw new HttpException(Errors.InvalidReserPasswordData, HttpStatusCode.BadRequest);
        }

        private async Task<string> CreateRefreshToken(int userId)
        {
            var refeshToken = jwtService.GetRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                Token = refeshToken,
                OlxUserId = userId,
                ExpirationDate = DateTime.UtcNow.AddDays(jwtService.GetRefreshTokenLiveTime())
            };
            await tokenRepository.AddAsync(refreshTokenEntity);
            await tokenRepository.SaveAsync();
            return refeshToken;
        }

        private async Task<RefreshToken> CheckRefreshTokenAsync(string refreshToken)
        {
            var token = await tokenRepository.GetItemBySpec(new RefreshTokenSpecs.GetByValue(refreshToken));
            if (token is not null)
            {
                if (token.ExpirationDate > DateTime.UtcNow)
                    return token;
                await tokenRepository.DeleteAsync(token.Id);
                await tokenRepository.SaveAsync();
            }
            throw new HttpException(Errors.InvalidToken, HttpStatusCode.Unauthorized);
        }

        
    }
}
