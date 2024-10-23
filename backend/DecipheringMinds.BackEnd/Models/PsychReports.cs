using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DecipheringMinds.BackEnd.Models
{
    public class PsychReports
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AppointmentId { get; set; }
        public string? ReferralReason { get; set; }
        public string? IntakeInformation { get; set; }
        public string? GeneralObservation { get; set; }
        public string? AssesmentProcedureResults { get; set; }
        public string? PsychometricProfile { get; set; }
        public string? ClinicalImpressionRecommendation { get; set; }
        public string? Diagnosis { get; set; }
        public bool? IsPublished { get; set; } = false;
        public bool? IsDeleted { get; set; } = false;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }

        [JsonIgnore]
        [ForeignKey("AppointmentId")]
        public virtual Appointments? Appointment { get; set; }
    }
}