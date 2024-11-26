using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.Entities
{
    public class Advert : BaseEntity
    {
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<FilterValue> FilterValues { get; set; }  = new HashSet<FilterValue>();
    }
}
