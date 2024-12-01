

using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities.FilterEntities
{
    public class FilterValue : BaseEntity
    {
        [StringLength(100)]
        public string Value { get; set; } = string.Empty;
        public ICollection<Filter> Filters { get; set; } = new HashSet<Filter>();
        public ICollection<Advert> Adverts { get; set; } = new HashSet<Advert>();
    }
}
