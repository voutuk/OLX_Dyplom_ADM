
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities.NewPost
{
    public class Area : NewPostBaseEntity
    {
        [StringLength(50)]
        public string RegionType { get; set; }

        public ICollection<Region> Regions { get; set; } = new HashSet<Region>();
    }
}
