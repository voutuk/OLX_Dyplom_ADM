
namespace Olx.BLL.Models
{
    public class PageResponse<TResult> where  TResult :class
    {
        public int Total { get; init; }
        public IEnumerable<TResult> Items { get; init; } = [];
    }
}
