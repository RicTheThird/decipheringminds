namespace DecipheringMinds.BackEnd.Models
{
    public class PsychNotes
    {
        public int Id { get; set; }
        public string NoteType { get; set; }
        public string Note { get; set; }
        public int UserId { get; set; }
        public bool IsPublished { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}