using DecipheringMinds.BackEnd.Models;
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
        private readonly IZoomApiService _zoomApiService;

        public AppointmentsController(ApplicationDbContext context, IEmailService emailService, IZoomApiService zoomApiService)
        {
            _emailService = emailService;
            _context = context;
            _zoomApiService = zoomApiService;
        }

        // GET: api/Appointments
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointments>>> GetAppointments()
        {
            return await _context.Appointments.Where(a => a.Status != "Cancelled")
                .Include(a => a.User)
                .Include(a => a.PsychReports).ToListAsync();
        }

        // GET: api/Appointments/5
        [Authorize]
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

        // GET: api/Appointments/5
        [Authorize]
        [HttpPost("unavailable-time")]
        public async Task<ActionResult<List<Appointments>>> GetUnAvalaibleAppointmentsTime(QueryAppointmentsByDate request)
        {
            var appointments = await _context.Appointments
                .Where(a => a.Status == "Confirmed" && a.BookedDate.Date == request.AppointmentDate.Date).ToListAsync();

            if (appointments == null)
            {
                return new List<Appointments>();
            }

            return appointments;
        }

        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Appointments>>> GetAppointmentsByUserId(int userId)
        {
            var appointments = await _context.Appointments.AsNoTracking().Include(a => a.User).Include(a => a.PsychReports)
                .Where(a => a.UserId == userId).OrderByDescending(a => a.BookedDate).ToListAsync();

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }

        [Authorize]
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

        [Authorize]
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
        public async Task<ActionResult<IEnumerable<Appointments>>> GetMyAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.PsychReports)
                .Where(a => a.UserId == GetUserId() && a.Status != "Cancelled").OrderByDescending(a => a.BookedDate).ToListAsync();

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }

        // PUT: api/Appointments/5
        [Authorize]
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
        public async Task<ActionResult<Appointments>> PostAppointments(Appointments request)
        {
            //Validate booking limit - only twice a week
            var weekAfterDate = request.BookedDate.AddDays(6);
            var weekBeforeDate = request.BookedDate.AddDays(-6);

            var existingApptsWeekBefore = await _context.Appointments
                .Where(a => a.UserId == GetUserId() && a.BookedDate >= weekBeforeDate && a.BookedDate <= request.BookedDate && new List<string> { "Confirmed", "Completed" }.Contains(a.Status)).ToListAsync();

            var existingApptsWeekAfter = await _context.Appointments
                .Where(a => a.UserId == GetUserId() && a.BookedDate <= weekAfterDate && a.BookedDate >= request.BookedDate && new List<string> { "Confirmed", "Completed" }.Contains(a.Status)).ToListAsync();

            if ((existingApptsWeekBefore != null && existingApptsWeekBefore.Count >= 2) ||
                (existingApptsWeekAfter != null && existingApptsWeekAfter.Count >= 2))
            {
                return BadRequest("Sorry you have reach the maximum allowed booking per week. <br /> You are allowed to a maximum 2 bookings in a week.");
            }

            ZoomMeetingResponse zoomDetails = null;

            if (request.BookedLocation == "Online")
            {
                zoomDetails = await _zoomApiService.GenerateZoomMeetingLink(request, GetUserEmail());
                if (zoomDetails != null)
                {
                    request.HostEmail = zoomDetails.host_email;
                    request.MeetingNumber = zoomDetails.id;
                    request.MeetingJoinUrl = zoomDetails.join_url;
                    request.MeetingStartUrl = zoomDetails.start_url;
                    request.MeetingPassword = zoomDetails.password;
                }
                else
                {
                    return BadRequest("Unable to create meeting");
                }
            }

            request.UserId = GetUserId();
            request.CreatedAt = DateTime.Now;
            request.Status = "Confirmed";
            _context.Appointments.Add(request);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync
                    (GetUserFirstName(), GetUserEmail(), "d-44062ce14e9642b393315355dde74f85",
                    new
                    {
                        FirstName = GetUserFirstName(),
                        Purpose = request.BookedType,
                        BookedDate = request.CreatedAt.ToString("yyyy-MM-dd"),
                        BookedTime = $"{request.StartTime}:00 - {request.EndTime}:00"
                    });

            return CreatedAtAction("GetAppointments", new { id = request.Id }, request);
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

    public class QueryAppointmentsByDate
    {
        public DateTime AppointmentDate { get; set; }
    }
}