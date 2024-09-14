using Microsoft.EntityFrameworkCore;

namespace DecipheringMinds.BackEnd.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<ApplicationUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the User entity
            modelBuilder.Entity<ApplicationUser>()
                .ToTable("Users") // Map to the table name in the database
                .HasKey(u => u.Id); // Set the primary key
        }
    }
}