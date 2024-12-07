
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.Category
{
    public class CategoryCreationModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; init; }
        public int? ParentId { get; init; }
        public IEnumerable<int>? FiltersIds { get; init; }
    }
}
