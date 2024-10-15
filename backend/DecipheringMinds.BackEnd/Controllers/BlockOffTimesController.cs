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
    public class BlockOffTimesController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public BlockOffTimesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BlockOffTimes
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlockOffTime>>> GetBlockOffTime()
        {
            return await _context.BlockOffTime.ToListAsync();
        }

        // GET: api/BlockOffTimes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlockOffTime>> GetBlockOffTime(int id)
        {
            var blockOffTime = await _context.BlockOffTime.FindAsync(id);

            if (blockOffTime == null)
            {
                return NotFound();
            }

            return blockOffTime;
        }

        // PUT: api/BlockOffTimes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBlockOffTime(int id, BlockOffTime blockOffTime)
        {
            if (id != blockOffTime.Id)
            {
                return BadRequest();
            }

            _context.Entry(blockOffTime).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlockOffTimeExists(id))
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

        // POST: api/BlockOffTimes
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BlockOffTime>> PostBlockOffTime(BlockOffTimeRequest blockOffTimeRequest)
        {
            var userId = GetUserId();
            if (blockOffTimeRequest == null)
                return BadRequest("Invalid Request");

            if (blockOffTimeRequest.IsRepeated != null && blockOffTimeRequest.IsRepeated.Value
                && blockOffTimeRequest.RepeatedDays != null && blockOffTimeRequest.BlockedEndDate != null)
            {
                var blockOffDates = new List<BlockOffTime>();
                foreach (var day in blockOffTimeRequest.RepeatedDays)
                {
                    var matchDays = GetAllDatesWithSameDay(blockOffTimeRequest.BlockedStartDate.Value, blockOffTimeRequest.BlockedEndDate.Value, day);
                    foreach (var blockDate in matchDays)
                    {
                        blockOffDates.Add(new BlockOffTime
                        {
                            UserId = userId,
                            BlockedDate = blockDate,
                            Reason = blockOffTimeRequest.Reason,
                            CreatedAt = DateTime.Now,
                            IsAllDay = blockOffTimeRequest.IsAllDay,
                            StartTime = blockOffTimeRequest.StartTime,
                            EndTime = blockOffTimeRequest.EndTime,
                            IsRepeated = true,
                            RepeatDays = day,
                            BlockEndDate = blockOffTimeRequest.BlockedEndDate
                        });
                    }
                }

                _context.BlockOffTime.AddRange(blockOffDates);
                await _context.SaveChangesAsync();
            }
            else
            {
                var blockOffTime = new BlockOffTime
                {
                    UserId = userId,
                    BlockedDate = blockOffTimeRequest.BlockedDate.Value,
                    Reason = blockOffTimeRequest.Reason,
                    CreatedAt = DateTime.Now,
                    IsAllDay = blockOffTimeRequest.IsAllDay,
                    StartTime = blockOffTimeRequest.StartTime,
                    EndTime = blockOffTimeRequest.EndTime
                };

                _context.BlockOffTime.Add(blockOffTime);
                await _context.SaveChangesAsync();
            }

            return Accepted();
        }

        // DELETE: api/BlockOffTimes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlockOffTime(int id)
        {
            var blockOffTime = await _context.BlockOffTime.FindAsync(id);
            if (blockOffTime == null)
            {
                return NotFound();
            }

            _context.BlockOffTime.Remove(blockOffTime);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("recurring/{id}")]
        public async Task<IActionResult> DeleteRecurringBlockOffTime(int id)
        {
            var one = await _context.BlockOffTime.FindAsync(id);
            if (one == null)
            {
                return NotFound();
            }

            var recurring = await _context.BlockOffTime.Where(b => b.Reason == one.Reason && b.IsAllDay == one.IsAllDay
                && b.StartTime == one.StartTime && b.EndTime == one.EndTime
                && b.BlockEndDate == one.BlockEndDate && b.BlockedDate >= one.BlockedDate).ToListAsync();

            _context.BlockOffTime.RemoveRange(recurring);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BlockOffTimeExists(int id)
        {
            return _context.BlockOffTime.Any(e => e.Id == id);
        }

        private static List<DateTime> GetAllDatesWithSameDay(DateTime start, DateTime end, int dayInt)
        {
            List<DateTime> dates = new List<DateTime>();
            var day = (DayOfWeek)dayInt;

            // Start from the first occurrence of the target day in the date range
            DateTime current = start;
            while (current.DayOfWeek != day)
            {
                current = current.AddDays(1);
            }

            // Collect all occurrences of the target day
            while (current <= end)
            {
                dates.Add(current);
                current = current.AddDays(7); // Move to the next week
            }

            return dates;
        }
    }

    public class BlockOffTimeRequest
    {
        public DateTime? BlockedDate { get; set; }
        public DateTime? BlockedStartDate { get; set; }
        public DateTime? BlockedEndDate { get; set; }
        public string? Reason { get; set; }
        public bool? IsAllDay { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public bool? IsRepeated { get; set; }
        public IEnumerable<int>? RepeatedDays { get; set; }
    }
}