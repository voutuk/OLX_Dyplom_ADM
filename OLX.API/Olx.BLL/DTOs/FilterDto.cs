

namespace Olx.BLL.DTOs
{
    public class FilterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<FilterValueDto>? Values { get; set; }
    }
}
