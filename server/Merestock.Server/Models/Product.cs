namespace Merestock.Server.Models
{ 
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}