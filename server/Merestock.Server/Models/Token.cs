namespace Merestock.Server.Models
{
    public class Token
    {
        public int Id { get; set; }
        public string RefreshToken { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
