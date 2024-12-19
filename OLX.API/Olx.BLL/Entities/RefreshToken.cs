
using Microsoft.EntityFrameworkCore;

namespace Olx.BLL.Entities
{
    public class RefreshToken :BaseEntity
    {
        public int OlxUserId { get; set; }
        public OlxUser OlxUser { get; set; } = null!;

        [Unicode(false)]
        public string Token { get; set; } = string.Empty;
        public DateTime ExpirationDate { get; set; }
    }
}
