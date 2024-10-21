using DecipheringMinds.BackEnd.Extensions;
using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Messages>>> GetMessages()
        {
            return await _context.Messages
                .Include(m => m.SenderUser)
                .Include(m => m.RecipientUser).ToListAsync();
        }

        // GET: api/Messages
        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<MessagesDTO>>> GetMyMessages()
        {
            return await _context.Messages.Where(m => m.RecipientId == GetUserId() || m.SenderId == GetUserId())
                .Include(m => m.SenderUser).Select(s => new MessagesDTO
                {
                    Id = s.Id,
                    Message = s.Message,
                    SenderId = s.SenderId,
                    RecipientId = s.RecipientId,
                    ClientMessageId = s.ClientMessageId,
                    SenderName = $"{s.SenderUser.FirstName} {s.SenderUser.LastName}",
                    RecipientName = $"{s.RecipientUser.FirstName} {s.RecipientUser.LastName}",
                    IsSeen = s.IsSeen,
                    CreatedAt = s.CreatedAt
                }).OrderByDescending(m => m.CreatedAt).ToListAsync();
        }

        // GET: api/Messages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Messages>> GetMessages(int id)
        {
            var messages = await _context.Messages.FindAsync(id);

            if (messages == null)
            {
                return NotFound();
            }

            return messages;
        }

        // PUT: api/Messages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessages(int id, Messages messages)
        {
            if (id != messages.Id)
            {
                return BadRequest();
            }

            _context.Entry(messages).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessagesExists(id))
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
        public async Task<ActionResult> PostMessages(MessageDTO msg)
        {
            if (msg.FromPatient == true)
            {
                var adminIDs = await _context.Users.Where(u => u.Role == "Staff"
                    && u.EmailVerified == true && u.Active == true).Select(u => u.Id).ToListAsync();
                var messages = new List<Messages>();
                foreach (var adminId in adminIDs)
                {
                    var message = new Messages();
                    message.RecipientId = adminId;
                    message.ClientMessageId = msg.ClientMsgId;
                    message.Message = msg.Message;
                    message.IsSeen = false;
                    message.CreatedAt = DateTime.UtcNow.ToSETimeFromUtc();
                    message.SenderId = GetUserId();
                    messages.Add(message);
                }
                _context.Messages.AddRange(messages);
            }
            else
            {
                var message = new Messages();
                message.RecipientId = msg.RecipientId ?? 0;
                message.Message = msg.Message;
                message.IsSeen = false;
                message.CreatedAt = DateTime.UtcNow.ToSETimeFromUtc();
                message.SenderId = GetUserId();
                _context.Messages.Add(message);
            }

            await _context.SaveChangesAsync();

            return Created();
        }

        [Authorize]
        [HttpPost("seen")]
        public async Task<ActionResult> SeenAll(MessageDTO msg)
        {
            var messages = await _context.Messages.Where(m => m.RecipientId == GetUserId() && m.SenderId == msg.SenderId).ToListAsync();
            foreach (var item in messages)
            {
                item.IsSeen = true;
            }
            await _context.SaveChangesAsync();
            return Created();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessages(int id)
        {
            var messages = await _context.Messages.FindAsync(id);
            if (messages == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(messages);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessagesExists(int id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }

    public class MessageDTO
    {
        public string? Message { get; set; }
        public bool? FromPatient { get; set; } = false;
        public int? RecipientId { get; set; }
        public int? SenderId { get; set; }
        public string? ClientMsgId { get; set; }
    }
}