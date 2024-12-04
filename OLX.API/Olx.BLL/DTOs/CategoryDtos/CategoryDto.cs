namespace Olx.BLL.DTOs.CategoryDtos
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Image { get; set; }
        public int? ParentId { get; set; }
        public IEnumerable<int> Filters { get; set; } = new HashSet<int>();
    }
}
