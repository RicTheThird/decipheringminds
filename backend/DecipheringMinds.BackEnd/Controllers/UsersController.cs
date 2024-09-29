using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System.Text;
using DecipheringMinds.BackEnd.Services;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public UsersController(ApplicationDbContext context, IEmailService emailService)
        {
            _emailService = emailService;
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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplicationUser(int id, ApplicationUser applicationUser)
        {
            if (id != applicationUser.Id)
            {
                return BadRequest();
            }

            _context.Entry(applicationUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationUserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

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
}