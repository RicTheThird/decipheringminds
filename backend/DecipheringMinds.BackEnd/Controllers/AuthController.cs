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

            var hashedEmail = HashEmail(userModel.Email);
            var encodedHashedEmail = UrlEncode(hashedEmail);

            var confirmUrl = $"https://localhost:3000/confirm?token={encodedHashedEmail}";

            await _emailService.SendEmailAsync
                (userModel.FirstName, userModel.Email, "d-6a4d5738050e40ff970209a53401c29f",
                new { FirstName = userModel.FirstName, VerifyAddressUrl = confirmUrl });

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
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetUser()
        {
            var userName = User.Identity.Name;
            return Ok(new { UserName = userName });
        }

        public static string HashEmail(string email)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(email));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2")); // Convert byte to hex string
                }
                return builder.ToString();
            }
        }

        public static string UrlEncode(string input)
        {
            return WebUtility.UrlEncode(input); // or Uri.EscapeDataString(input);
        }
    }
}

public class LoginModel
{
    public string UserName { get; set; }
    public string Password { get; set; }
}