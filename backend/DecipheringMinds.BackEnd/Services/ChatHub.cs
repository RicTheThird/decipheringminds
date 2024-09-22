using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.SignalR;

namespace DecipheringMinds.BackEnd.Services
{
    public class ChatHub : Hub
    {
        private static readonly Dictionary<string, User> ConnectedUsers = new();

        public override async Task OnConnectedAsync()
        {
            var username = Context.GetHttpContext().Request.Query["username"];
            if (!ConnectedUsers.ContainsKey(username))
            {
                ConnectedUsers[username] = new User { UserName = username, IsOnline = true };
            }

            await Clients.All.SendAsync("UpdateUserStatus", username, true);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var username = Context.User.Identity.Name;
            if (ConnectedUsers.ContainsKey(username))
            {
                ConnectedUsers[username].IsOnline = false;
                await Clients.All.SendAsync("UpdateUserStatus", username, false);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string sender, string receiver, string message)
        {
            var msg = new Message
            {
                Sender = sender,
                Receiver = receiver,
                Content = message,
                Timestamp = DateTime.UtcNow
            };

            // Save to database (implement this as per your DB context)
            // _dbContext.Messages.Add(msg);
            // await _dbContext.SaveChangesAsync();

            await Clients.User(receiver).SendAsync("ReceiveMessage", msg);
        }

        public async Task<List<Message>> GetMessages(string user1, string user2)
        {
            // Fetch messages from the database
            // return await _context.Messages.Where(m => (m.Sender == user1 && m.Receiver == user2) ||
            //                                             (m.Sender == user2 && m.Receiver == user1))
            //                                .OrderBy(m => m.Timestamp)
            //                                .ToListAsync();

            return new List<Message>();
        }
    }
}