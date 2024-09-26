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
    public class PsychReportsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public PsychReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PsychReports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PsychReports>>> GetPsychReports()
        {
            return await _context.PsychReports.ToListAsync();
        }

        // GET: api/PsychReports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PsychReports>> GetPsychReports(int id)
        {
            var psychReports = await _context.PsychReports.FindAsync(id);

            if (psychReports == null)
            {
                return NotFound();
            }

            return psychReports;
        }

        // PUT: api/PsychReports/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPsychReports(int id, PsychReports psychReports)
        {
            if (id != psychReports.Id)
            {
                return BadRequest();
            }

            _context.Entry(psychReports).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PsychReportsExists(id))
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

        // POST: api/PsychReports
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PsychReports>> PostPsychReports(PsychReports psychReports)
        {
            if (psychReports == null)
            {
                return BadRequest(string.Empty);
            }

            if (psychReports.Id != 0)
            {
                var existingReport = await _context.PsychReports.FindAsync(psychReports.Id);
                if (existingReport != null)
                {
                    _context.PsychReports.Remove(existingReport);
                }
            }

            psychReports.CreatedAt = DateTime.Now;
            psychReports.UpdatedAt = DateTime.Now;
            psychReports.CreatedBy = GetUserId();
            psychReports.IsPublished = true;
            _context.PsychReports.Add(psychReports);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPsychReports", new { id = psychReports.Id }, psychReports);
        }

        // DELETE: api/PsychReports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePsychReports(int id)
        {
            var psychReports = await _context.PsychReports.FindAsync(id);
            if (psychReports == null)
            {
                return NotFound();
            }

            _context.PsychReports.Remove(psychReports);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PsychReportsExists(int id)
        {
            return _context.PsychReports.Any(e => e.Id == id);
        }
    }
}