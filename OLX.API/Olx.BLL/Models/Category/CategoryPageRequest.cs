using Olx.BLL.Models.Page;


namespace Olx.BLL.Models.Category
{
    public class CategoryPageRequest : PageRequest
    {
        public string? SearchName { get; init; }
        public int ParentId { get; init; }
    }
}
