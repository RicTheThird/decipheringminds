using Ardalis.Result;
using DecipheringMinds.BackEnd.Models;

namespace DecipheringMinds.BackEnd.Services
{
    public interface IUserService
    {
        Task<ApplicationUser> Authenticate(string userName, string password);

        Task<bool> IsUserExists(string email);

        Task<Result> Register(ApplicationUser appUser, string role = "Customer");

        Task<ApplicationUser?> GetUserByEmail(string email);

        Task<Result> ConfirmEmail(string email);

        Task UpdateUser(ApplicationUser user);

        Task<ApplicationUser?> GetUserByForgotPasswordToken(string token);

        Task<ApplicationUser?> GetUserByInvitationToken(string token);

        Task SendAdminMessage(int recipientUserId);

        string HashPassword(string password);
    }
}