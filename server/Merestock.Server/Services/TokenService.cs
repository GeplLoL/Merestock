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

        public (string accessToken, string refreshToken) GenerateTokens(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["JWT:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var atoken = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds);
            var rtoken = new JwtSecurityToken(
                signingCredentials: creds,
                expires: DateTime.UtcNow.AddDays(7));

            return (_handler.WriteToken(atoken), _handler.WriteToken(rtoken));
        }

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
                return null;
            }
        }

        public async Task SaveRefreshTokenAsync(int userId, string refreshToken)
        {
            var t = await _ctx.Tokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (t != null) t.RefreshToken = refreshToken;
            else _ctx.Tokens.Add(new Token { UserId = userId, RefreshToken = refreshToken });
            await _ctx.SaveChangesAsync();
        }

        public async Task RemoveRefreshTokenAsync(string refreshToken)
        {
            var t = await _ctx.Tokens.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);
            if (t != null) _ctx.Tokens.Remove(t);
            await _ctx.SaveChangesAsync();
        }
    }
}
