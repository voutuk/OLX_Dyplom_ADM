namespace Olx.BLL.Models.Page
{
    public class PageRequest
    {
        public int Size { get; init; }
        public int Page { get; init; }
        public int SortIndex { get; init; }
        public bool IsDescending { get; init; }
    }
}
