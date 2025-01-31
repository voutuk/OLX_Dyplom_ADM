

using Olx.BLL.Models.Page;


namespace Olx.BLL.Models.Advert
{
    public class AdvertPageRequest : PageRequest
    {
        public decimal PriceFrom { get; init; }
        public decimal PriceTo { get; init; }
        public string? Search { get; init; }
        public string? CategorySearch { get; init; }
        public string? PhoneSearch { get; init; }
        public string? EmailSearch { get; init; }
        public string? SettlementSearch { get; init; }
        public bool IsContractPrice { get; init; } = false;
        public bool Approved { get; init; } = false;
        public bool Blocked { get; init; } = false;
        public bool Archived { get; init; } = false;
        public IEnumerable<int>? CategoryIds { get; init; }
        public IEnumerable<int>? Filters { get; init; }
    }
}
