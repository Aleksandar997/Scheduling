using Common.Base;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchedulingAPI.Hubs
{
    public class SignalHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var identity = (ClaimsIdentity)Context.User.Identity;
            var employeeId = Convert.ToInt32(identity.Claims.SingleOrDefault(p => p.Type == ClaimTypes.UserData)?.Value);
            NotificationHubManager.ConnectedUsers.Add(new ConnectedUser(Context.ConnectionId, employeeId));
            return (base.OnConnectedAsync());
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            var disconnectedUser = NotificationHubManager.ConnectedUsers.FindIndex(x => x.ConnectionId == Context.ConnectionId);
            NotificationHubManager.ConnectedUsers.RemoveAt(disconnectedUser);
            return base.OnDisconnectedAsync(exception);
        }
    }
    public class ConnectedUser
    {
        public string ConnectionId { get; set; }
        public int Id { get; set; }

        public ConnectedUser(string connectionId, int id)
        {
            ConnectionId = connectionId;
            Id = id;
        }
    }
    public static class NotificationHubManager
    {
        static IHubContext<SignalHub> _hubContext = DependencyInjectionResolver.GetService<IHubContext<SignalHub>>();
        public static List<ConnectedUser> ConnectedUsers = new List<ConnectedUser>();
        public static async Task Notify(long insertedId, List<int> receiverIds) =>
            await _hubContext.Clients.Clients(ConnectedUsers
                                                .Where(x => receiverIds.Contains(x.Id))
                                                .Select(x => x.ConnectionId).ToList()
                                             ).SendAsync("AddedScheduleForEmployee", insertedId);
        
    }
}
