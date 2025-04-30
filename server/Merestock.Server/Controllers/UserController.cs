using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Merestock.Server.DTOs;
using Merestock.Server.Services;

[ApiController]
// Baastee kõigi päringute jaoks: /api/User
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _users;

    // Sõltuvuste süstimine: kasutajateenuse instants
    public UserController(UserService users) => _users = users;

    // POST /api/User/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var res = await _users.RegisterAsync(dto);
        // Lisame HTTP-only küpsise värskendustokeniga, kehtivus 7 päeva
        Response.Cookies.Append("refreshToken", res.RefreshToken,
            new CookieOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(7) });
        return Ok(res);
    }

    // GET /api/User/activate/{link}
    [HttpGet("activate/{link}")]
    public async Task<IActionResult> Activate(string link)
    {
        await _users.ActivateAsync(link);
        // Pärast aktiveerimist saadame kasutaja kliendi rakendusse
        return Redirect(Environment.GetEnvironmentVariable("CLIENT_URL")!);
    }

    // POST /api/User/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var res = await _users.LoginAsync(dto);
        Response.Cookies.Append("refreshToken", res.RefreshToken,
            new CookieOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(7) });
        return Ok(res);
    }

    // POST /api/User/logout
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var rt = Request.Cookies["refreshToken"]!; // loeme küpsise
        await _users.LogoutAsync(rt);               // tühistame tokeni serveris
        Response.Cookies.Delete("refreshToken");    // eemaldame küpsise
        return Ok();
    }

    // GET /api/User/refresh
    [HttpGet("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var rt = Request.Cookies["refreshToken"]!;
        var res = await _users.RefreshAsync(rt);
        // Asendame vana tokeniga värskenduse uuega
        Response.Cookies.Append("refreshToken", res.RefreshToken,
            new CookieOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(7) });
        return Ok(res);
    }

    // GET /api/User
    //[Authorize] // vajadusel lubamiseks
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _users.GetAllAsync()); // tagastame kõigi kasutajate loendi
}
