using System.Diagnostics.Eventing.Reader;

namespace DecipheringMinds.BackEnd.Models
{
    public class Notifications
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string NotificationType { get; set; }
        public int UserId { get; set; }
        public bool IsSeen { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}