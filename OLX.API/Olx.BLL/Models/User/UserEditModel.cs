
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.User
{
    public class UserEditModel 
    {
        public int Id { get; set; }
        public string? OldPassword { get; set; }
        public string? Password { get; set; } = string.Empty;
        public string? PasswordConfirmation { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public FormFile? ImageFile { get; set; }
        public string? WebSite { get; set; }
        public string? About { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
