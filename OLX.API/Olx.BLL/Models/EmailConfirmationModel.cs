namespace Olx.BLL.Models
{
    public class EmailConfirmationModel
    {
        public string Email { get; init; } = string.Empty;
        public string Token { get; init; } = string.Empty;
    }
}
