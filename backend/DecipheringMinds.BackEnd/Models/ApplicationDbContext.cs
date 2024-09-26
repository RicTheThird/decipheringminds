using Microsoft.EntityFrameworkCore;
using DecipheringMinds.BackEnd.Models;

namespace DecipheringMinds.BackEnd.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Appointments> Appointments { get; set; }
        public DbSet<UserTests> UserTests { get; set; }
        public DbSet<UserTestScores> UserTestScores { get; set; }
        public DbSet<PsychNotes> PsychNotes { get; set; }
        public DbSet<Notifications> Notifications { get; set; }
        public DbSet<Feedbacks> Feedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the User entity
            modelBuilder.Entity<ApplicationUser>()
                .ToTable("Users") // Map to the table name in the database
                .HasKey(u => u.Id); // Set the primary key

            //modelBuilder.Entity<Appointments>()
            //    .ToTable("Appointments") // Map to the table name in the database
            //    .HasKey(u => u.Id); // Set the primary key

            //modelBuilder.Entity<UserTests>()
            //    .ToTable("UserTests")
            //    .HasMany(u => u.UserScores);
        }

        public DbSet<DecipheringMinds.BackEnd.Models.Messages> Messages { get; set; } = default!;
        public DbSet<DecipheringMinds.BackEnd.Models.PsychReports> PsychReports { get; set; } = default!;
    }
}