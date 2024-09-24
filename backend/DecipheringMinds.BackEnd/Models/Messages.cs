using System.ComponentModel.DataAnnotations.Schema;

namespace DecipheringMinds.BackEnd.Models
{
    public class Messages
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public bool IsSeen { get; set; }
        public string? ClientMessageId { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey("SenderId")]
        public virtual ApplicationUser? SenderUser { get; set; }

        [ForeignKey("RecipientId")]
        public virtual ApplicationUser? RecipientUser { get; set; }
    }

    public class MessagesDTO
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string SenderName { get; set; }
        public string RecipientName { get; set; }
        public string? ClientMessageId { get; set; }
        public bool IsSeen { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}