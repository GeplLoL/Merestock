namespace Merestock.Server.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public int ProductId { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}