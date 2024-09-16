using Ardalis.Result;
using DecipheringMinds.BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace DecipheringMinds.BackEnd.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApplicationUser> Authenticate(string userName, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.EmailVerified == true && x.Email == userName);
            if (user == null) return null;

            if (VerifyPassword(password, user.PasswordHash))
                return user;

            return null;
        }

        public async Task<Result> ConfirmEmail(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (user == null) return Result.Error();
            user.EmailVerified = true;
            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result> Register(ApplicationUser appUser)
        {
            appUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(appUser.PasswordHash);
            appUser.Role = "Customer";
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == appUser.Email);
            if (user != null) return Result.Error("User already exists");

            await _context.Users.AddAsync(appUser);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
    }
}