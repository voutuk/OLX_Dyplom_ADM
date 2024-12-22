
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities
{
    [Table("tbl_AdminMessages")]
    public class AdminMessage : BaseEntity
    {
        public bool FromAdmin { get; set; }
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;
        public OlxUser User { get; set; }
        public int UserId { get; set; }
        public bool Readed { get; set; }
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;
        public bool Deleted { get; set; }
    }
}
