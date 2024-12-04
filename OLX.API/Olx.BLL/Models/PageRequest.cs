
namespace Olx.BLL.Models
{
    public class PageRequest
    {
        public int Size { get; init; }
        public int Page { get; init; }
        public int SortIndex { get; init; }
        public bool IsDescending { get; init; }
    }
}
