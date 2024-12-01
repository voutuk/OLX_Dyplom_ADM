
namespace Olx.BLL.Models.User
{
    public class UserBlockModel
    {
        public string Email { get; init; } = string.Empty;
        public bool Block { get; init; }
        public DateTime? LockoutEndDate { get; init; }
        public string? BlockReason { get; init; }

    }
}
