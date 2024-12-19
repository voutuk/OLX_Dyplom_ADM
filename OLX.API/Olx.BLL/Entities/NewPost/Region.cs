

using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities.NewPost
{
    public class Region :NewPostBaseEntity
    {
        [StringLength(50)]
        public string RegionType { get; set; }

        [StringLength(36)]
        [Unicode(false)]
        public string AreaRef { get; set; }

        [JsonIgnore]
        public Area Area { get; set; }

        public ICollection<Settlement> Settlements  = new HashSet<Settlement>();
    }
}
