using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Merestock.Server.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
                Groups.AddToGroupAsync(Context.ConnectionId, userId);
            return base.OnConnectedAsync();
        }
    }
}
