using DecipheringMinds.BackEnd.Models;
using DecipheringMinds.BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public UsersController(ApplicationDbContext context, IEmailService emailService, IUserService userService)
        {
            _emailService = emailService;
            _userService = userService;
            _context = context;
        }

        // GET: api/Users
        [Authorize]
        [HttpGet("role/{role}")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers(string role)
        {
            return await _context.Users.Where(u => u.Role == role && u.EmailVerified == true).ToListAsync();
        }

        // GET: api/ApplicationUsers/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUser>> GetApplicationUser(int id)
        {
            var applicationUser = await _context.Users.FindAsync(id);

            if (applicationUser == null)
            {
                return NotFound();
            }

            return applicationUser;
        }

        // PUT: api/ApplicationUsers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> PutApplicationUser(UserDTO userDTO)
        {
            if (userDTO == null)
            {
                return BadRequest();
            }
            var userId = GetUserId();
            var applicationUser = await _context.Users.FindAsync(userId);
            if (applicationUser == null)
            {
                return NotFound();
            }
            applicationUser.PhoneNumber = userDTO.PhoneNumber;
            applicationUser.BirthDate = userDTO.BirthDate;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> PutNewPassword(ChangePasswordRequest request)
        {
            if (request.NewPassword == null)
            {
                return BadRequest();
            }
            var userId = GetUserId();

            var user = await _userService.Authenticate(GetUserEmail(), request.CurrentPassword);
            if (user == null) { return BadRequest("Current password given is incorrect."); }
            user.PasswordHash = _userService.HashPassword(request.NewPassword);
            await _userService.UpdateUser(user);
            return NoContent();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ApplicationUser>> PostApplicationUser(ApplicationUser applicationUser)
        {
            _context.Users.Add(applicationUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApplicationUser", new { id = applicationUser.Id }, applicationUser);
        }

        [Authorize]
        [HttpPost("invite")]
        public async Task<ActionResult<ApplicationUser>> InviteUser(ApplicationUser user)
        {
            var userExists = await _context.Users.Where(u => u.Email == user.Email).FirstOrDefaultAsync();
            if (userExists != null) { return BadRequest("User already exist."); }

            var token = Guid.NewGuid().ToString();
            byte[] bytes = Encoding.UTF8.GetBytes(token);
            string base64String = Convert.ToBase64String(bytes);
            var encodedToken = WebUtility.UrlEncode(base64String);

            var inviteUrl = $"https://decipheringminds.com/staff-register?token={encodedToken}"; //PROD
            //var inviteUrl = $"http://localhost:3000/staff-register?token={encodedToken}";
            try
            {
                user.InvitationKey = token;
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                await _emailService.SendEmailAsync
                (user?.FirstName ?? "", user.Email, "d-431ed34733b94042a024a7ac1cdd43a9",
                new { InvitationUrl = inviteUrl });

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/ApplicationUsers/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplicationUser(int id)
        {
            var messagesToDelete = await _context.Messages.Where(m => m.SenderId == id || m.RecipientId == id).ToListAsync();
            _context.Messages.RemoveRange(messagesToDelete);
            var applicationUser = await _context.Users.FindAsync(id);
            if (applicationUser == null)
            {
                return NotFound();
            }

            _context.Users.Remove(applicationUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApplicationUserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    public class InviteRequest
    {
        public string Email { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}