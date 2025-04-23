namespace Merestock.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public bool IsActivated { get; set; }
        public string ActivationLink { get; set; } = null!;
        public ICollection<Token> Tokens { get; set; } = new List<Token>();
    }
}
