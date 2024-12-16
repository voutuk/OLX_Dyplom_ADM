using Olx.BLL.Entities;
using System.ComponentModel.DataAnnotations;


namespace Olx.BLL.DTOs
{
    public class AdminMessageDto : BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public string UserName { get; set; }
        public int UserId { get; set; }
        public bool Readed { get; set; }
        public string Subject { get; set; } = string.Empty;
    }
}
