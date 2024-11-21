
namespace Olx.BLL.Entities
{
    public class RefreshToken :BaseEntity
    {
        public int OlxUserId { get; set; }
        public required OlxUser OlxUser { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
