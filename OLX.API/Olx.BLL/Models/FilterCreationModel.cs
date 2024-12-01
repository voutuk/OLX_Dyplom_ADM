
namespace Olx.BLL.Models
{
    public class FilterCreationModel
    {
        public int Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public IEnumerable<string>? NewValues { get;init; }
        public IEnumerable<int>? ValuesIds { get; init; }
    }
}
