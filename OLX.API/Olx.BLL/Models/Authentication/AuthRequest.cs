

namespace Olx.BLL.Models.Authentication
{
    public class AuthRequest
    {
        public required string Email { get; init; }
        public required string Password { get; init; }
    }
}
