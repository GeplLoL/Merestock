using Merestock.Server.Models;

namespace Merestock.Server.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = null!;

        public ProductDto() { }

        public ProductDto(Product p)
        {
            Id = p.Id;
            Title = p.Title;
            Price = p.Price;
            ImageUrl = p.ImageUrl;
            UserId = p.UserId;
            UserEmail = p.User?.Email ?? "";
        }
    }
}
