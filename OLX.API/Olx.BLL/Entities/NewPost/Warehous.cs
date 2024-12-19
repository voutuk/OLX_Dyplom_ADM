
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities.NewPost
{
    public class Warehous : NewPostBaseEntity
    {
        public string Phone { get; set; } = string.Empty;

        [StringLength(36)]
        [Unicode(false)]
        public string SettlementRef { get; set; }
        public Settlement Settlement { get; set; }
    }
}
