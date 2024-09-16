﻿using DecipheringMinds.BackEnd.Models;
using DecipheringMinds.BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public AppointmentsController(ApplicationDbContext context, IEmailService emailService)
        {
            _emailService = emailService;
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointments>>> GetAppointments()
        {
            return await _context.Appointments.Where(a => a.Status != "Cancelled").Include(a => a.User).ToListAsync();
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointments>> GetAppointments(int id)
        {
            var appointments = await _context.Appointments.Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Appointments>>> GetAppointmentsByUserId(int userId)
        {
            var appointments = await _context.Appointments.Include(a => a.User)
                .Where(a => a.UserId == userId).ToListAsync();

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<Appointments>>> GetAppointmentsByStatus(string status)
        {
            var appointments = await _context.Appointments.Include(a => a.User)
                .Where(a => a.Status == status).ToListAsync();

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }

        [HttpPut("status/{status}/{id}")]
        public async Task<ActionResult<IEnumerable<Appointments>>> UpdateAppointmentByStatus(string status, int id)
        {
            var appointment = await _context.Appointments
                .Where(a => a.Id == id).FirstOrDefaultAsync();

            if (appointment == null)
            {
                return NotFound();
            }

            appointment.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<Appointments>>> GetMyAppointmentsBy()
        {
            var appointments = await _context.Appointments
                .Where(a => a.UserId == GetUserId() && a.Status != "Cancelled").ToListAsync();

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }

        // PUT: api/Appointments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointments(int id, Appointments appointments)
        {
            if (id != appointments.Id)
            {
                return BadRequest();
            }

            _context.Entry(appointments).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentsExists(id))
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

        // POST: api/Appointments
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Appointments>> PostAppointments(Appointments appointments)
        {
            appointments.UserId = GetUserId();
            appointments.CreatedAt = DateTime.Now;
            appointments.Status = "Pending Confirmation";
            _context.Appointments.Add(appointments);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync
                    (GetUserFirstName(), GetUserEmail(), "d-44062ce14e9642b393315355dde74f85",
                    new
                    {
                        FirstName = GetUserFirstName(),
                        Purpose = appointments.BookedType,
                        BookedDate = appointments.CreatedAt.ToString("yyyy-MM-dd"),
                        BookedTime = $"{appointments.StartTime}:00 - {appointments.EndTime}:00"
                    });

            return CreatedAtAction("GetAppointments", new { id = appointments.Id }, appointments);
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointments(int id)
        {
            var appointments = await _context.Appointments.FindAsync(id);
            if (appointments == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointments);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentsExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
    }
}