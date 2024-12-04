

using AutoMapper;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.DTOs
{
    [AutoMap(typeof(Filter))]
    public class FilterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<FilterValueDto>? Values { get; set; }
    }
}
