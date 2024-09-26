using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json.Serialization;

namespace DecipheringMinds.BackEnd.Models
{
    public class ApplicationUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }

        public string PasswordHash { get; set; }
        public string? ForgotPasswordKey { get; set; }
        public string Email { get; set; }

        [JsonIgnore]
        public string? PhoneNumber { get; set; }

        [JsonIgnore]
        public string? Role { get; set; } = "Customer";

        [JsonIgnore]
        public bool? EmailVerified { get; set; }

        public DateTime BirthDate { get; set; }
    }
}