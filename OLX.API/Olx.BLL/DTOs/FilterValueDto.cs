
using AutoMapper;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.DTOs
{
    [AutoMap(typeof(FilterValue))]
    public class FilterValueDto
    {
        public int Id { get; set; }
        public string Value { get; set; } = string.Empty;
    }
}
