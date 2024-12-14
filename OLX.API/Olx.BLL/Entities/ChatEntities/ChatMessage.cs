
namespace Olx.BLL.Entities.ChatEntities
{
    public class ChatMessage : BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public OlxUser Sender { get; set; }
        public int SenderId { get; set; }
        public Chat Chat { get; set; }
        public int ChatId { get; set; }
        public bool Readed { get; set; }
    }
}
