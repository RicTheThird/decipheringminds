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
    public class PsychNotesController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public PsychNotesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PsychNotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PsychNotes>>> GetPsychNotes()
        {
            return await _context.PsychNotes.ToListAsync();
        }

        // GET: api/PsychNotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PsychNotes>> GetPsychNotes(int id)
        {
            var psychNotes = await _context.PsychNotes.FindAsync(id);

            if (psychNotes == null)
            {
                return NotFound();
            }

            return psychNotes;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PsychNotes>>> GetPsychNotesByUser(int userId)
        {
            var psychNotes = await _context.PsychNotes.
                Where(p => p.UserId == userId && !p.IsDeleted).ToListAsync();

            if (psychNotes == null)
            {
                return NotFound();
            }

            return psychNotes;
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<PsychNotes>>> GetMyPsychNotesByUser()
        {
            var psychNotes = await _context.PsychNotes.
                Where(p => p.UserId == GetUserId() && p.IsPublished && !p.IsDeleted).ToListAsync();

            if (psychNotes == null)
            {
                return NotFound();
            }

            return psychNotes;
        }

        // PUT: api/PsychNotes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPsychNotes(int id, PsychNotes psychNotes)
        {
            if (id != psychNotes.Id)
            {
                return BadRequest();
            }

            _context.Entry(psychNotes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PsychNotesExists(id))
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

        // POST: api/PsychNotes
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PsychNotes>> PostPsychNotes(PsychNotes psychNotes)
        {
            psychNotes.CreatedBy = GetUserId();
            psychNotes.CreatedAt = DateTime.Now;
            psychNotes.IsPublished = false;
            psychNotes.IsDeleted = false;
            _context.PsychNotes.Add(psychNotes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPsychNotes", new { id = psychNotes.Id }, psychNotes);
        }

        // DELETE: api/PsychNotes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePsychNotes(int id)
        {
            var psychNotes = await _context.PsychNotes.FindAsync(id);
            if (psychNotes == null)
            {
                return NotFound();
            }

            _context.PsychNotes.Remove(psychNotes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PsychNotesExists(int id)
        {
            return _context.PsychNotes.Any(e => e.Id == id);
        }
    }
}