﻿using System.Text;
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

        // Sõltuvuste süstimine: andmebaasi kontekst ja konfiguratsioon
        public AuthService(AppDbContext ctx, IConfiguration cfg)
        {
            _context = ctx;
            _config = cfg;
        }

        // Uue kasutaja registreerimine
        public async Task<User> Register(RegisterDto dto)
        {
            var user = new User { Email = dto.Email };
            // Parooli räsi genereerimine
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();   // salvestame kasutaja
            return user;
        }

        // Kasutaja sisselogimine ja JWT genereerimine
        public async Task<LoginResponse> Login(LoginDto dto)
        {
            // Otsime kasutajat e-posti järgi
            var user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.Email == dto.Email);
            // Kontrollime parooli õigsust
            if (user == null ||
                _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password)
                != PasswordVerificationResult.Success)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            // Võtme ja allkirjastamise seadistus JWT jaoks
            var secret = _config["JWT:Secret"]
                         ?? throw new InvalidOperationException("JWT:Secret not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Lisame tokenile põhilised claims’id
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            // Koostame ja allkirjastame JWT, kehtivus 7 päeva
            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            // Tagastame JWT-stringi ja kasutaja ID
            return new LoginResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                UserId = user.Id
            };
        }
    }
}
