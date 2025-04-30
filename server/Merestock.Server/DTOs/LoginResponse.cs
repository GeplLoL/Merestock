namespace Merestock.Server.DTOs
{
    // Andmestruktuur sisselogimise vastuseks API kaudu
    public class LoginResponse
    {
        // Määrab autentimisel saadud JWT-tokeni
        public string Token { get; set; }

        // Sisseloginud kasutaja ID
        public int UserId { get; set; }
    }
}
