using Merestock.Server.Models;

namespace Merestock.Server.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public bool IsActivated { get; set; }
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;

        public UserDto() { }

        // Convenience constructor to map from your User entity
        public UserDto(User user)
        {
            Id = user.Id;
            Email = user.Email;
            IsActivated = user.IsActivated;
        }
    }
}
