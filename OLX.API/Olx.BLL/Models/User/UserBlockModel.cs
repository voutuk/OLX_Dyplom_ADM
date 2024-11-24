
namespace Olx.BLL.Models.User
{
    public class UserBlockModel
    {
        public string Email { get; set; } = string.Empty;
        public bool Block { get; set; }
        public DateTime? LockoutEndDate { get; set; }
        public string? BlockReason { get; set; }

    }
}
