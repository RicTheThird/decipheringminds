namespace DecipheringMinds.BackEnd.Models
{
    public class Message
    {
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class User
    {
        public string UserName { get; set; }
        public bool IsOnline { get; set; }
    }
}