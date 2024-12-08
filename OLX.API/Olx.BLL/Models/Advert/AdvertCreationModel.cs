
using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.Advert
{
    public class AdvertCreationModel
    {
        public int Id { get; init; }
        public int UserId { get; init; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPersone { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsContractPrice { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public ICollection<int> FilterValueIds { get; set; } = new HashSet<int>();
        public ICollection<IFormFile> ImageFiles { get; set; } = new HashSet<IFormFile>();
    }
}
