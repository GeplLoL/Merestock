using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Merestock.Server.Data;
using Merestock.Server.DTOs;
using Merestock.Server.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Merestock.Server.Services
{
    public class UserService
    {
        private readonly AppDbContext _ctx;
        private readonly MailService _mail;
        private readonly TokenService _tokens;
        private readonly PasswordHasher<User> _hasher = new();


        public UserService(AppDbContext ctx, MailService mail, TokenService tokens)
        {

            _ctx = ctx;
            _mail = mail;
            _tokens = tokens;
        }

        public async Task<UserDto> RegisterAsync(RegisterDto dto)
        {
            if (await _ctx.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Пользователь уже существует");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = _hasher.HashPassword(null!, dto.Password),
                ActivationLink = Guid.NewGuid().ToString()
            };
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            var link = $"{Environment.GetEnvironmentVariable("API_URL")}/api/user/activate/{user.ActivationLink}";
            await _mail.SendActivationMailAsync(user.Email, link);

            var dtoUser = new UserDto(user);
            var (at, rt) = _tokens.GenerateTokens(user);
            await _tokens.SaveRefreshTokenAsync(user.Id, rt);
            dtoUser.AccessToken = at;
            dtoUser.RefreshToken = rt;
            return dtoUser;
        }

        public async Task ActivateAsync(string link)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(u => u.ActivationLink == link);
            if (user == null) throw new Exception("Некорректная ссылка");
            user.IsActivated = true;
            await _ctx.SaveChangesAsync();
        }

        public async Task<UserDto> LoginAsync(LoginDto dto)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null ||
                _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password)
                != PasswordVerificationResult.Success)
                throw new Exception("Неверные данные");

            var dtoUser = new UserDto(user);
            var (at, rt) = _tokens.GenerateTokens(user);
            await _tokens.SaveRefreshTokenAsync(user.Id, rt);
            dtoUser.AccessToken = at;
            dtoUser.RefreshToken = rt;
            return dtoUser;
        }

        public async Task LogoutAsync(string refreshToken)
        {
            await _tokens.RemoveRefreshTokenAsync(refreshToken);
        }

        public async Task<UserDto> RefreshAsync(string refreshToken)
        {
            var principal = _tokens.Validate(refreshToken, isRefresh: true)
                            ?? throw new Exception("Неавторизован");
            var userId = int.Parse(
                principal.FindFirst(JwtRegisteredClaimNames.Sub)!.Value
            );
            var user = await _ctx.Users.FindAsync(userId);
            if (user == null) throw new Exception("Неавторизован");

            var dtoUser = new UserDto(user);
            var (at, rt) = _tokens.GenerateTokens(user);
            await _tokens.SaveRefreshTokenAsync(user.Id, rt);
            dtoUser.AccessToken = at;
            dtoUser.RefreshToken = rt;
            return dtoUser;
        }

        public async Task<IList<User>> GetAllAsync()
            => await _ctx.Users.ToListAsync();
    }
}
