
namespace Olx.BLL.Models
{
    public class ResetPasswordModel
    {
        public string Password { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
