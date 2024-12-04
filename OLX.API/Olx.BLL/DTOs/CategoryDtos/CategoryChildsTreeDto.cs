
using AutoMapper;
using Olx.BLL.Entities;

namespace Olx.BLL.DTOs.CategoryDtos
{
    [AutoMap(typeof(Category))]
    public class CategoryChildsTreeDto : CategoryDto
    {
        public IEnumerable<CategoryChildsTreeDto> Childs { get; set; } = new HashSet<CategoryChildsTreeDto>();
    }
}
