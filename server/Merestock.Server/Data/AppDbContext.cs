using Microsoft.EntityFrameworkCore;
using Merestock.Server.Models;

namespace Merestock.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Token> Tokens { get; set; }


        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
