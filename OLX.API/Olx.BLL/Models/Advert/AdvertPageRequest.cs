

using AutoMapper;
using Olx.BLL.Models.Page;
using Olx.BLL.Pagination.Filters;

namespace Olx.BLL.Models.Advert
{
    [AutoMap(typeof(AdvertFilter))]
    public class AdvertPageRequest :PageRequest
    {
        public decimal PriceFrom { get; init; }
        public decimal PriceTo { get; init; }
        public string? Search { get; init; }
        public bool IsContractPrice { get; init; } = false;
        public bool Approved { get; set; } = false;
        public bool Blocked { get; set; } = false;
        public int CategoryId { get; set; }
        public IEnumerable<int>? Filters { get; set; }
    }
}
