namespace Olx.BLL.Models
{
    public class EmailConfirmationModel
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
