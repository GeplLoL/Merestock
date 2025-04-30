namespace Merestock.Server.DTOs
{
    // Andmestruktuur uue toote loomiseks API kaudu
    public class CreateProductDto
    {
        // Toote pealkiri (nõutav)
        public string Title { get; set; } = null!;

        // Toote hind (nõutav)
        public decimal Price { get; set; }

        // Toote pildi URL (valikuline)
        public string? ImageUrl { get; set; }

        // Selle toote looja kasutaja ID
        public int UserId { get; set; }
    }
}
