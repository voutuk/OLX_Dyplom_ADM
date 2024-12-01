

using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.User
{
    public class UserCreationModel
    {
        public string Email { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
        public string PasswordConfirmation { get; init; } = string.Empty;
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public FormFile? ImageFile { get; init; }
        public string? WebSite { get; init; }
        public string? About { get; init; }
        public string? PhoneNumber { get; init; }
    }
}
