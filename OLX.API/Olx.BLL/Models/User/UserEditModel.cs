
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.User
{
    public class UserEditModel 
    {
        public int Id { get; init; }
        public string? OldPassword { get; init; }
        public string? Password { get; init; } = string.Empty;
        public string? PasswordConfirmation { get; init; } = string.Empty;
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public IFormFile? ImageFile { get; init; }
        public string? WebSite { get; init; }
        public string? About { get; init; }
        public string? PhoneNumber { get; init; }
    }
}
