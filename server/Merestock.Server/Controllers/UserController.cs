using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Merestock.Server.DTOs;
using Merestock.Server.Services;

namespace Merestock.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _users;

        public UserController(UserService users) => _users = users;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var res = await _users.RegisterAsync(dto);
            Response.Cookies.Append("refreshToken", res.RefreshToken,
                new CookieOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(7) });
            return Ok(res);
        }

        [HttpGet("activate/{link}")]
        public async Task<IActionResult> Activate(string link)
        {
            await _users.ActivateAsync(link);
            return Redirect(Environment.GetEnvironmentVariable("CLIENT_URL")!);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var res = await _users.LoginAsync(dto);
            Response.Cookies.Append("refreshToken", res.RefreshToken,
                new CookieOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(7) });
            return Ok(res);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var rt = Request.Cookies["refreshToken"]!;
            await _users.LogoutAsync(rt);
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }

        [HttpGet("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var rt = Request.Cookies["refreshToken"]!;
            var res = await _users.RefreshAsync(rt);
            Response.Cookies.Append("refreshToken", res.RefreshToken,
                new CookieOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(7) });
            return Ok(res);
        }

        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _users.GetAllAsync());
    }
}
