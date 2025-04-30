using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Merestock.Server.Data;
using Merestock.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Merestock.Server.Services
{
    // Teenus JWT ja värskendustokenite haldamiseks
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _ctx;
        private readonly JwtSecurityTokenHandler _handler = new();

        public TokenService(IConfiguration cfg, AppDbContext ctx)
        {
            _config = cfg;
            _ctx = ctx;
        }

        // Loo juurdepääsu token ühe tunnise kehtivusajaga
        public string CreateToken(User user)
        {
            // Võtme ja allkirjastamiscredentials seadistus
            var secret = _config["JWT:Secret"]
                         ?? throw new InvalidOperationException("JWT Secret missing");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Lisame tokenile kasutaja ID ja e-posti
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            // Koostame JWT, mis aegub 1 tunni pärast
            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return _handler.WriteToken(token);
        }

        // Genereeri access ja refresh tokenid
        public (string accessToken, string refreshToken) GenerateTokens(User user)
        {
            // Põhicläited access tokenile
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["JWT:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Access token kehtib 15 minutit
            var atoken = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds);

            // Refresh token kehtib 7 päeva
            var rtoken = new JwtSecurityToken(
                signingCredentials: creds,
                expires: DateTime.UtcNow.AddDays(7));

            return (_handler.WriteToken(atoken), _handler.WriteToken(rtoken));
        }

        // Valideeri JWT ja tagasta ClaimsPrincipal või null
        public ClaimsPrincipal? Validate(string token, bool isRefresh = false)
        {
            try
            {
                var secretKey = _config["JWT:Secret"]!;
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _config["JWT:Issuer"],
                    ValidAudience = _config["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero
                };
                return _handler.ValidateToken(token, parameters, out _);
            }
            catch
            {
                return null; // vale token või aegunud
            }
        }

        // Salvestab või uuendab värskendustokeni andmebaasis
        public async Task SaveRefreshTokenAsync(int userId, string refreshToken)
        {
            var t = await _ctx.Tokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (t != null)
                t.RefreshToken = refreshToken;
            else
                _ctx.Tokens.Add(new Token { UserId = userId, RefreshToken = refreshToken });

            await _ctx.SaveChangesAsync();
        }

        // Eemaldab refresh tokeni andmebaasist
        public async Task RemoveRefreshTokenAsync(string refreshToken)
        {
            var t = await _ctx.Tokens.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);
            if (t != null)
                _ctx.Tokens.Remove(t);

            await _ctx.SaveChangesAsync();
        }
    }
}
