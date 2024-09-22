using DecipheringMinds.BackEnd.Models;
using DecipheringMinds.BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
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
            var response = await _userService.Register(userModel);
            if (response.IsSuccess)
            {
                // encode email
                byte[] bytes = Encoding.UTF8.GetBytes(userModel.Email);
                string base64String = Convert.ToBase64String(bytes);
                var encodedEmail = WebUtility.UrlEncode(base64String);

                var confirmUrl = $"https://decipheringminds.com/register?token={encodedEmail}";
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
            return response.IsSuccess ? Ok() : BadRequest();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userService.Authenticate(model.UserName, model.Password);
            if (user == null)
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim(ClaimTypes.UserData, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
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
            var base64Email = WebUtility.UrlDecode(request.Token);
            byte[] bytes = Convert.FromBase64String(base64Email);
            // Convert byte array to string
            string decodedEmail = Encoding.UTF8.GetString(bytes);

            var result = await _userService.ConfirmEmail(decodedEmail);
            return result.IsSuccess ? Ok() : BadRequest();
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetUser()
        {
            var userName = User.Identity.Name;
            return Ok(new { UserName = userName });
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