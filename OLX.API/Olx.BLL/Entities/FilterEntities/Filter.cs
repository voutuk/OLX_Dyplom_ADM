namespace Olx.BLL.Entities.FilterEntities
{
    public class Filter : BaseNamedEntity
    {
        public ICollection<Category> Categories = new HashSet<Category>();
        public ICollection<FilterValue> Values = new HashSet<FilterValue>();
    }
}
