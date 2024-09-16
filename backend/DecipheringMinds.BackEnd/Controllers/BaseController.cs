using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;

public abstract class BaseController : ControllerBase
{
    // Method to get the UserId from claims
    protected int GetUserId()
    {
        if (User.Identity.IsAuthenticated)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData);
            return int.Parse(userIdClaim?.Value);
        }
        return 0; // or throw an exception if you want to enforce that the user must be authenticated
    }

    protected string GetUserEmail()
    {
        if (User.Identity.IsAuthenticated)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            return userIdClaim?.Value;
        }
        return null; // or throw an exception if you want to enforce that the user must be authenticated
    }

    protected string GetUserFirstName()
    {
        if (User.Identity.IsAuthenticated)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            return userIdClaim?.Value.Split(" ")[0];
        }
        return null; // or throw an exception if you want to enforce that the user must be authenticated
    }

    // Optionally, add more methods to extract different claims or handle claims in various ways
}