﻿
using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination.Filters
{
    public class AdvertFilter : IPaginationFilter<Advert>
    {
        public decimal PriceFrom { get; init; }
        public decimal PriceTo { get; init; }
        public string? Search { get; init; }
        public bool? IsContractPrice { get; init; }
        public bool? Approved { get; init; }
        public bool? Blocked { get; init; }
        public string? CategorySearch { get; init; }
        public string? PhoneSearch { get; init; }
        public string? EmailSearch { get; init; }
        public string? SettlementSearch { get; init; }
        public IEnumerable<int>? CategoryIds { get; init; }
        public IEnumerable<IEnumerable<int>>? Filters { get; init; }
        public IQueryable<Advert> FilterQuery(IQueryable<Advert> query)
        {
            if (CategoryIds is not null && CategoryIds.Any())
            {
                query = query.Where(x => CategoryIds.Any(z => z == x.CategoryId));
            }

            if (Filters is not null && Filters.Any())
            {
                foreach (var filter in Filters) 
                {
                    query = query.Where(x => filter.Any(z => x.FilterValues.Any(y => y.Id == z)));
                }
            }

            if (PriceFrom > 0)
            {
                query = query.Where(x => x.Price >= PriceFrom);
            }

            if (PriceTo > PriceFrom)
            {
                query = query.Where(x => x.Price <= PriceTo);
            }
            if (!String.IsNullOrWhiteSpace(Search))
            {
                query = query.Where(x => x.Title.ToLower().Contains(Search.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(CategorySearch))
            {
                query = query.Where(x => x.Category.Name.ToLower().Contains(CategorySearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(PhoneSearch))
            {
                query = query.Where(x => x.PhoneNumber.Contains(PhoneSearch));
            }
            if (!String.IsNullOrWhiteSpace(EmailSearch))
            {
                query = query.Where(x => x.ContactEmail.ToLower().Contains(EmailSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(SettlementSearch))
            {
                query = query.Where(x => x.Settlement.Description.ToLower().Contains(SettlementSearch.ToLower()));
            }
            if (IsContractPrice.HasValue)
            {
                query = query.Where(x => x.IsContractPrice == IsContractPrice);
            }
            if (Approved.HasValue)
            {
                query = query.Where(x => x.Approved == Approved);
            }
            if (Blocked.HasValue)
            {
                query = query.Where(x => x.Blocked == Blocked);
            }

            return query;
        }
    }
}
