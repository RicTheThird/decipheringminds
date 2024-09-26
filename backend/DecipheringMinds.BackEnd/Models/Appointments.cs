using DecipheringMinds.BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace DecipheringMinds.BackEnd.Models
{
    public class Appointments
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public DateTime BookedDate { get; set; }
        public string BookedType { get; set; }
        public string? Status { get; set; }
        public int AttendedBy { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? BookedLocation { get; set; }
        public long? MeetingNumber { get; set; }
        public string? MeetingStartUrl { get; set; }
        public string? MeetingJoinUrl { get; set; }
        public string? MeetingPassword { get; set; }
        public string? HostEmail { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }

        public ICollection<PsychReports>? PsychReports { get; set; }
    }
}