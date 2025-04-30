namespace Merestock.Server.DTOs
{
    // Andmestruktuur kasutaja sisselogimiseks API kaudu
    public class LoginDto
    {
        // Kasutaja e-post (nõutav)
        public string Email { get; set; }

        // Kasutaja parool (nõutav)
        public string Password { get; set; }
    }
}
