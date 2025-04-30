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
    // Teenus kasutajate registreerimiseks, sisselogimiseks, värskendustokeni halduseks jms
    public class UserService
    {
        private readonly AppDbContext _ctx;
        private readonly MailService _mail;
        private readonly TokenService _tokens;
        private readonly PasswordHasher<User> _hasher = new();

        // Sõltuvuste süstimine: andmebaas, e-posti- ja tokeniteenus
        public UserService(AppDbContext ctx, MailService mail, TokenService tokens)
        {
            _ctx = ctx;
            _mail = mail;
            _tokens = tokens;
        }

        // Uue kasutaja registreerimine ja aktiveerimisposti saatmine
        public async Task<UserDto> RegisterAsync(RegisterDto dto)
        {
            // Kontrollime, et sama e-postiga kasutajat ei oleks juba olemas
            if (await _ctx.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Kasutaja juba eksisteerib");

            // Loome uue User-mudeli ja räsi paroolist
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = _hasher.HashPassword(null!, dto.Password),
                ActivationLink = Guid.NewGuid().ToString()
            };
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            // Koostame aktiveerimislingi ja saadame selle e-kirjaga
            var link = $"{Environment.GetEnvironmentVariable("API_URL")}/api/user/activate/{user.ActivationLink}";
            await _mail.SendActivationMailAsync(user.Email, link);

            // Valmistame UserDto ja genereerime tokenid
            var dtoUser = new UserDto(user);
            var (at, rt) = _tokens.GenerateTokens(user);
            await _tokens.SaveRefreshTokenAsync(user.Id, rt);

            // Lisame DTO-sse access- ja refresh-tokenid
            dtoUser.AccessToken = at;
            dtoUser.RefreshToken = rt;
            return dtoUser;
        }

        // Konto aktiveerimine lingi alusel
        public async Task ActivateAsync(string link)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(u => u.ActivationLink == link);
            if (user == null)
                throw new Exception("Vale aktiveerimislink");

            user.IsActivated = true;
            await _ctx.SaveChangesAsync();
        }

        // Sisselogimine: parooli kontroll ja uute tokenite genereerimine
        public async Task<UserDto> LoginAsync(LoginDto dto)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null ||
                _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password)
                != PasswordVerificationResult.Success)
            {
                throw new Exception("Vale e-post või parool");
            }

            // Täidame UserDto ja uuendame tokenid
            var dtoUser = new UserDto(user);
            var (at, rt) = _tokens.GenerateTokens(user);
            await _tokens.SaveRefreshTokenAsync(user.Id, rt);

            dtoUser.AccessToken = at;
            dtoUser.RefreshToken = rt;
            return dtoUser;
        }

        // Väljalogimine: eemaldame refresh-tokeni andmebaasist
        public async Task LogoutAsync(string refreshToken)
        {
            await _tokens.RemoveRefreshTokenAsync(refreshToken);
        }

        // Tokenite värskendamine: valideerime refresh-tokeni ja anname uued tokenid
        public async Task<UserDto> RefreshAsync(string refreshToken)
        {
            var principal = _tokens.Validate(refreshToken, isRefresh: true)
                            ?? throw new Exception("Kasutaja pole autoriseeritud");

            // Loeme userid claim’ist ja leiame vastava kasutaja
            var userId = int.Parse(principal.FindFirst(JwtRegisteredClaimNames.Sub)!.Value);
            var user = await _ctx.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("Kasutaja pole autoriseeritud");

            // Genereerime uued tokenid ja salvestame refresh-tokeni
            var dtoUser = new UserDto(user);
            var (at, rt) = _tokens.GenerateTokens(user);
            await _tokens.SaveRefreshTokenAsync(user.Id, rt);

            dtoUser.AccessToken = at;
            dtoUser.RefreshToken = rt;
            return dtoUser;
        }

        // Tagastab kõigi kasutajate nimekirja (nt admin-ekraani jaoks)
        public async Task<IList<User>> GetAllAsync()
            => await _ctx.Users.ToListAsync();
    }
}
