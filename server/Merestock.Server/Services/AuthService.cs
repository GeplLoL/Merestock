using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Merestock.Server.Data;
using Merestock.Server.DTOs;
using Merestock.Server.Models;

namespace Merestock.Server.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<User> _hasher = new();

        public AuthService(AppDbContext ctx, IConfiguration cfg)
        {
            _context = ctx;
            _config = cfg;
        }

        public async Task<User> Register(RegisterDto dto)
        {
            var user = new User { Email = dto.Email };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<LoginResponse> Login(LoginDto dto)
        {
            var user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null ||
                _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password)
                != PasswordVerificationResult.Success)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            // Берём секрет прямо из конфига (строка)
            var secret = _config["JWT:Secret"]
                         ?? throw new InvalidOperationException("JWT:Secret not configured");
            // Конвертируем его в байты
            var keyBytes = Encoding.UTF8.GetBytes(secret);
            // Генерируем симметричный ключ
            var key = new SymmetricSecurityKey(keyBytes);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new LoginResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                UserId = user.Id
            };
        }
    }
}
