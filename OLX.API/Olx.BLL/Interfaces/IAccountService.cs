using Olx.BLL.Models;
using Olx.BLL.Models.Authentication;

namespace Olx.BLL.Interfaces
{
    public interface IAccountService
    {
        Task<AuthResponse> LoginAsync(AuthRequest model);
        Task LogoutAsync(string token);
        Task<AuthResponse> RefreshTokensAsync(string refreshToken);
        Task EmailConfirmAsync(EmailConfirmationModel confirmationModel);
        Task FogotPasswordAsync(string email);
        Task ResetPasswordAsync(ResetPasswordModel resetPasswordModel);
    }
}
