﻿namespace DecipheringMinds.BackEnd.Models
{
    public class Feedbacks
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}