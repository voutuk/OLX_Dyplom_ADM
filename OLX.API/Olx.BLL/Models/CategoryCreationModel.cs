
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models
{
    public class CategoryCreationModel
    {
        public int Id { get; set; }
        public IFormFile? ImageFile { get; init; }
        public int? ParentId { get; init; }
        public IEnumerable<int>? FiltersIds { get; init; }
    }
}
