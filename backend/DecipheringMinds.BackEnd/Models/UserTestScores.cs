using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DecipheringMinds.BackEnd.Models
{
    public class UserTestScores
    {
        public int Id { get; set; }
        public int TestId { get; set; }
        public string ScoreType { get; set; }
        public string ScoreInterpretation { get; set; }
        public int Score { get; set; }
        public bool IsPublished { get; set; }

        [JsonIgnore]
        [ForeignKey("TestId")]
        public virtual UserTests? UserTests { get; set; }
    }
}