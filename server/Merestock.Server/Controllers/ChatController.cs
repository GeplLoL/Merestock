using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Merestock.Server.Data;
using Merestock.Server.Models;
using Merestock.Server.Hubs;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _ctx;
    private readonly IHubContext<ChatHub> _hub;

    public ChatController(AppDbContext ctx, IHubContext<ChatHub> hub)
    {
        _ctx = ctx;
        _hub = hub;
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] Message m)
    {
        _ctx.Messages.Add(m);                   // lisame uue sõnumi konteksti
        await _ctx.SaveChangesAsync();          // salvestame selle andmebaasi
        await _hub
            .Clients
            .User(m.ReceiverId.ToString())
            .SendAsync("ReceiveMessage", m);   // saadame sõnumi reaalajas vastuvõtjale
        return Ok();                            // anname kliendile teada, et toiming õnnestus
    }
}
