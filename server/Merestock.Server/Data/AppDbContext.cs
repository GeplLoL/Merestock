using Microsoft.EntityFrameworkCore;
using Merestock.Server.Models;

namespace Merestock.Server.Data
{
    // Andmebaasi kontekst: hallatakse EF Core’i kaudu rakenduse andmeobjekte
    public class AppDbContext : DbContext
    {
        // Kasutajate tabel
        public DbSet<User> Users { get; set; }

        // Toodete tabel
        public DbSet<Product> Products { get; set; }

        // Sõnumite tabel
        public DbSet<Message> Messages { get; set; }

        // Värskendustokenite tabel
        public DbSet<Token> Tokens { get; set; }

        // Konstruktor saab konfiguratsiooni (ühendusstring jms) süstimise teel
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}
