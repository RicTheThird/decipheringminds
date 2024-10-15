using System.ComponentModel.DataAnnotations.Schema;

namespace DecipheringMinds.BackEnd.Models
{
    public class BlockOffTime
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime BlockedDate { get; set; }
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool? IsAllDay { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public bool? IsRepeated { get; set; }
        public int? RepeatDays { get; set; }
        public DateTime? BlockEndDate { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }
    }
}