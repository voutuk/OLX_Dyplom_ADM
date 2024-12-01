
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models
{
    public class CategoryCreationModel
    {
        public FormFile? ImageFile { get; init; }
        public int? ParentId { get; init; }
        public IEnumerable<CategoryCreationModel>? Childs { get; init; }
        public IEnumerable<int>? FiltersIds { get; init; }
    }
}
