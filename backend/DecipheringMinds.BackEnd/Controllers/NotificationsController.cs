using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.Authorization;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notifications>>> GetNotifications()
        {
            return await _context.Notifications.ToListAsync();
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<Notifications>>> GetMyNotifications()
        {
            return await _context.Notifications.Where(n => n.UserId == GetUserId()).ToListAsync();
        }

        // GET: api/Notifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Notifications>> GetNotifications(int id)
        {
            var notifications = await _context.Notifications.FindAsync(id);

            if (notifications == null)
            {
                return NotFound();
            }

            return notifications;
        }

        // PUT: api/Notifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotifications(int id, Notifications notifications)
        {
            if (id != notifications.Id)
            {
                return BadRequest();
            }

            _context.Entry(notifications).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationsExists(id))
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

        // POST: api/Notifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Notifications>> PostNotifications(Notifications notifications)
        {
            _context.Notifications.Add(notifications);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotifications", new { id = notifications.Id }, notifications);
        }

        // DELETE: api/Notifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotifications(int id)
        {
            var notifications = await _context.Notifications.FindAsync(id);
            if (notifications == null)
            {
                return NotFound();
            }

            _context.Notifications.Remove(notifications);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotificationsExists(int id)
        {
            return _context.Notifications.Any(e => e.Id == id);
        }
    }
}