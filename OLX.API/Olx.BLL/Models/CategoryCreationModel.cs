
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Olx.BLL.Entities;

namespace Olx.BLL.Models
{
    [AutoMap(typeof(Category))]
    public class CategoryCreationModel
    {
        public int Id { get; set; }
        public IFormFile? ImageFile { get; init; }
        public int? ParentId { get; init; }
        public IEnumerable<int>? FiltersIds { get; init; }
    }
}
