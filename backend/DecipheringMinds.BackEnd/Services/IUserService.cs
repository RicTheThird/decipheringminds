using Ardalis.Result;
using DecipheringMinds.BackEnd.Models;

namespace DecipheringMinds.BackEnd.Services
{
    public interface IUserService
    {
        Task<ApplicationUser> Authenticate(string userName, string password);

        Task<Result> Register(ApplicationUser appUser);

        Task<Result> ConfirmEmail(string email);
    }
}