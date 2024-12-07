
namespace Olx.BLL.Models.FilterModels
{
    public class FilterEditModel
    {
        public int Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public IEnumerable<string>? NewValues { get; init; } = new HashSet<string>();
        public IEnumerable<int>? OldValueIds { get; init; } = new HashSet<int>();
    }
}
