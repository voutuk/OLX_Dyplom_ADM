namespace OLX.API.Models
{
    public class SeaderUserModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; } 
        public string Role { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ImageBase64 { get; set; }
        public string? ImageUrl { get; set; }
    }
}
