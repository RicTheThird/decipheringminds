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

        public async Task<bool> IsUserExists(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == email);
            return user != null;
        }

        public async Task<ApplicationUser?> GetUserByEmail(string email)
            => await _context.Users.SingleOrDefaultAsync(x => x.Email == email);

        public async Task<ApplicationUser?> GetUserByForgotPasswordToken(string token)
            => await _context.Users.SingleOrDefaultAsync(x => x.ForgotPasswordKey == token);

        public async Task<Result> ConfirmEmail(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (user == null) return Result.Error("Invalid token or link expired.");
            user.EmailVerified = true;
            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task UpdateUser(ApplicationUser user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<Result> Register(ApplicationUser appUser, string role = "Customer")
        {
            appUser.PasswordHash = HashPassword(appUser.PasswordHash);
            appUser.Role = role;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == appUser.Email);
            if (user != null) return Result.Error("User already exists. If you forgot your password, please reset it by clicking on Forgot Password.");

            await _context.Users.AddAsync(appUser);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
    }
}