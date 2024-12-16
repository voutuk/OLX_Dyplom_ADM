
using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities.ChatEntities
{
    public class ChatMessage : BaseEntity
    {
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;
        public OlxUser Sender { get; set; }
        public int SenderId { get; set; }
        public Chat Chat { get; set; }
        public int ChatId { get; set; }
        public bool Readed { get; set; }
    }
}
