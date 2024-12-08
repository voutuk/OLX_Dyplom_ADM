

namespace Olx.BLL.Entities
{
    public class AdvertImage : BaseNamedEntity
    {
        public int AdvertId { get; set; }
        public Advert Advert { get; set; }
        public int Priority { get; set; }
    }
}
