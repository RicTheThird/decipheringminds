using DecipheringMinds.BackEnd.Models;
using DecipheringMinds.BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly string _jwtSecret;

        public AuthController(IUserService userService, IEmailService emailService, IConfiguration configuration)
        {
            _userService = userService;
            _emailService = emailService;
            _jwtSecret = configuration["Jwt:Secret"];
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] ApplicationUser userModel)
        {
            userModel.Active = true;
            var response = await _userService.Register(userModel);
            if (response.IsSuccess)
            {
                // encode email
                byte[] bytes = Encoding.UTF8.GetBytes(userModel.Email);
                string base64String = Convert.ToBase64String(bytes);
                var encodedEmail = WebUtility.UrlEncode(base64String);

                //var confirmUrl = $"http://localhost:3000/register?token={encodedEmail}";
                var confirmUrl = $"https://decipheringminds.com/register?token={encodedEmail}"; //PROD
                try
                {
                    await _emailService.SendEmailAsync
                    (userModel.FirstName, userModel.Email, "d-6a4d5738050e40ff970209a53401c29f",
                    new { FirstName = userModel.FirstName, VerifyAddressUrl = confirmUrl });
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            return response.IsSuccess ? Ok() : BadRequest(response.Errors.FirstOrDefault());
        }

        [AllowAnonymous]
        [HttpPost("register-staff/{key}")]
        public async Task<IActionResult> RegisterStaff([FromBody] ApplicationUser userModel, string key)
        {
            var user = await _userService.GetUserByInvitationToken(DecodeTokenKey(key));
            if (user != null)
            {
                user.EmailVerified = true;
                user.PhoneNumber = userModel.PhoneNumber;
                user.PasswordHash = _userService.HashPassword(userModel.PasswordHash);
                user.FirstName = userModel.FirstName;
                user.LastName = userModel.LastName;
                user.BirthDate = userModel.BirthDate;
                user.Gender = userModel.Gender;
                user.InvitationKey = null;
                user.ForgotPasswordKey = null;
                user.Active = true;

                try
                {
                    await _userService.UpdateUser(user);
                    await _userService.SendAdminMessage(user.Id);
                    return Ok();
                }
                catch (Exception e)
                {
                    return BadRequest("Request failed. Please try again later.");
                }
            }
            return BadRequest("Invalid request. Token might have expired, please ask admin to resend invitation");
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userService.Authenticate(model.UserName, model.Password);
            if (user == null)
                return Unauthorized("LoginFailed");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim(ClaimTypes.SerialNumber, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }

        [AllowAnonymous]
        [HttpPost("confirm-email")]
        public async Task<IActionResult> Confirm([FromBody] ConfirmRequest request)
        {
            string decodedEmail = string.Empty;
            try
            {
                decodedEmail = DecodeTokenKey(request.Token);
            }
            catch (Exception)
            {
                return BadRequest("Error occured: Invalid token.");
            }

            var result = await _userService.ConfirmEmail(decodedEmail);
            return result.IsSuccess ? Ok() : BadRequest(result.Errors.FirstOrDefault());
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var userModel = await _userService.GetUserByEmail(request.Email);
            if (userModel != null)
            {
                var token = Guid.NewGuid().ToString();
                byte[] bytes = Encoding.UTF8.GetBytes(token);
                string base64String = Convert.ToBase64String(bytes);
                var encodedToken = WebUtility.UrlEncode(base64String);

                var resetUrl = $"https://decipheringminds.com/forgot-password?token={encodedToken}"; //PROD
                //var resetUrl = $"http://localhost:3000/forgot-password?token={encodedToken}";
                try
                {
                    await _emailService.SendEmailAsync
                    (userModel.FirstName, userModel.Email, "d-d2ab2ea393934116a8fddb9be53cb3bb",
                    new { FirstName = userModel.FirstName, ResetPasswordUrl = resetUrl });

                    //Add key
                    userModel.ForgotPasswordKey = token;
                    await _userService.UpdateUser(userModel);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return Accepted();
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            string decodedToken = string.Empty;
            try
            {
                decodedToken = DecodeTokenKey(request.Token);
            }
            catch (Exception)
            {
                return BadRequest("Error occured: Invalid token.");
            }

            var userModel = await _userService.GetUserByForgotPasswordToken(decodedToken);
            if (userModel != null)
            {
                try
                {
                    userModel.PasswordHash = _userService.HashPassword(request.NewPassword);
                    userModel.EmailVerified = true;
                    userModel.ForgotPasswordKey = null;
                    await _userService.UpdateUser(userModel);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return BadRequest("Invalid request. Token have expired.");
            }
            return Accepted();
        }

        [AllowAnonymous]
        [HttpGet("verify-key/{key}")]
        public async Task<IActionResult> VerifyForgotPasswordKey(string key)
        {
            if (string.IsNullOrEmpty(key)) return BadRequest("Invalid token");
            string decodedToken = string.Empty;
            try
            {
                decodedToken = DecodeTokenKey(key);
            }
            catch (Exception)
            {
                return BadRequest("Invalid token");
            }
            var userModel = await _userService.GetUserByForgotPasswordToken(decodedToken);
            return userModel != null ? Accepted() : BadRequest("Invalid request. Token have expired.");
        }

        [AllowAnonymous]
        [HttpGet("verify-invite/{key}")]
        public async Task<ActionResult<string>> VerifyInvitationKey(string key)
        {
            if (string.IsNullOrEmpty(key)) return BadRequest("Invalid token");
            string decodedToken = string.Empty;
            try
            {
                decodedToken = DecodeTokenKey(key);
            }
            catch (Exception)
            {
                return BadRequest("Invalid request. Token might have expired, please ask admin to resend invitation.");
            }
            var userModel = await _userService.GetUserByInvitationToken(decodedToken);
            return userModel != null ? Ok(userModel.Email) : BadRequest("Invalid request. Token have expired.");
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetUser()
        {
            var userEmail = GetUserEmail();
            var user = await _userService.GetUserByEmail(userEmail);

            var responseDTO = new UserDTO
            {
                Email = userEmail,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = user.Gender,
                BirthDate = user.BirthDate,
                PhoneNumber = user.PhoneNumber
            };

            return Ok(responseDTO);
        }

        public static string DecodeTokenKey(string rawString)
        {
            var base64Token = WebUtility.UrlDecode(rawString);
            byte[] bytes = Convert.FromBase64String(base64Token);
            return Encoding.UTF8.GetString(bytes);
        }
    }
}

public class LoginModel
{
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class ConfirmRequest
{
    public string Token { get; set; }
}

public class ForgotPasswordRequest
{
    public string Email { get; set; }
}

public class ResetPasswordRequest
{
    public string Token { get; set; }
    public string NewPassword { get; set; }
}

public class UserDTO
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? BirthDate { get; set; }
}