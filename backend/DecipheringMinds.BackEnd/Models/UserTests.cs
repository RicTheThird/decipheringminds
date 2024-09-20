namespace DecipheringMinds.BackEnd.Models
{
    public class UserTests
    {
        public int Id { get; set; }
        public string TestId { get; set; }
        public int UserId { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }

        public ICollection<UserTestScores>? UserTestScores { get; set; }
    }
}