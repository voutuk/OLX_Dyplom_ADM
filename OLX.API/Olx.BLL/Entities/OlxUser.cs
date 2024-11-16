using Microsoft.AspNetCore.Identity;

namespace Olx.BLL.Entities
{
    public class OlxUser : IdentityUser<int>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Image { get; set; }
    }
}
