using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DecipheringMinds.BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTestsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public UserTestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/UserTests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserTests>>> GetUserTests()
        {
            return await _context.UserTests.Where(u => !u.IsDeleted)
                .Include(u => u.UserTestScores).ToListAsync();
        }

        // GET: api/UserTests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserTests>> GetUserTests(int id)
        {
            var userTests = await _context.UserTests.FindAsync(id);

            if (userTests == null)
            {
                return NotFound();
            }

            return userTests;
        }

        // GET: api/UserTests/UserId/5
        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserTests>>> GetUserTestsByUserId(int userId)
        {
            var userTests = await _context.UserTests
                .Where(u => u.UserId == userId && !u.IsDeleted)
                .OrderByDescending(u => u.SubmittedAt)
                .Include(u => u.UserTestScores).ToListAsync();

            if (userTests == null)
            {
                return new List<UserTests>();
            }

            return userTests;
        }

        // GET: api/UserTests/UserId/5
        [Authorize]
        [HttpGet("unpublish")]
        public async Task<ActionResult<IEnumerable<UserTestScores>>> GetUnpublishTestResult()
        {
            var userTests = await _context.UserTestScores
                .Where(u => !u.IsPublished).ToListAsync();

            if (userTests == null)
            {
                return new List<UserTestScores>();
            }

            return userTests;
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<UserTests>>> GetMyUserTests()
        {
            var userTests = await _context.UserTests
                .Where(u => u.UserId == GetUserId() && !u.IsDeleted)
                .Include(u => u.UserTestScores).OrderByDescending(u => u.SubmittedAt).ToListAsync();

            if (userTests == null)
            {
                return NotFound();
            }

            return userTests;
        }

        //[Authorize]
        [HttpGet("analytics/days/{previousDayCount}")]
        public async Task<ActionResult<IEnumerable<Analytics>>> GetPsychResultAnalytics(int previousDayCount)
        {
            DateTime thirtyDaysAgo = DateTime.Now.AddDays(-previousDayCount);

            var scoreSummary = await _context.UserTests
                .Where(ut => ut.SubmittedAt >= thirtyDaysAgo)
                .SelectMany(ut => ut.UserTestScores,
                            (ut, score) => new { score.ScoreType, score.ScoreInterpretation })
                .GroupBy(x => new { x.ScoreType, x.ScoreInterpretation })
                .Select(g => new ScoreSummary
                {
                    ScoreType = g.Key.ScoreType,
                    ScoreInterpretation = g.Key.ScoreInterpretation,
                    Count = g.Count()
                })
                .ToListAsync();

            return Ok(scoreSummary);
        }

        // PUT: api/UserTests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserTests(int id, UserTests userTests)
        {
            if (id != userTests.Id)
            {
                return BadRequest();
            }

            _context.Entry(userTests).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTestsExists(id))
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
        [HttpPut("score/{id}")]
        public async Task<ActionResult<UserTests>> PostUserScore(int id, List<UserTestScores> userTestScores)
        {
            if (userTestScores != null && userTestScores.Any())
            {
                //delete existing
                var existingScore = await _context.UserTestScores.Where(u => u.TestId == id).ToListAsync();
                _context.UserTestScores.RemoveRange(existingScore);
                await _context.SaveChangesAsync();

                //save
                var userScores = new List<UserTestScores>();
                foreach (var score in userTestScores)
                {
                    userScores.Add(
                        new UserTestScores
                        {
                            TestId = id,
                            Score = score.Score,
                            ScoreType = score.ScoreType,
                            ScoreInterpretation = score.ScoreInterpretation,
                            IsPublished = score.IsPublished,
                        });
                }
                _context.UserTestScores.AddRange(userScores);

                var userTests = await _context.UserTests.FindAsync(id);
                userTests.IsSubmitted = true;
                userTests.SubmittedAt = DateTime.Now;

                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest();
            }

            return NoContent();
        }

        // POST: api/UserTests
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<UserTests>> PostUserTests(List<UserTests> userTests)
        {
            if (userTests != null && userTests.Any())
            {
                foreach (var test in userTests)
                {
                    var userTestModel = new UserTests
                    {
                        UserId = test.UserId,
                        TestId = test.TestId,
                        IsDeleted = false,
                        IsSubmitted = false,
                        CreatedAt = DateTime.Now
                    };

                    _context.UserTests.Add(userTestModel);
                    await _context.SaveChangesAsync();

                    if (test.UserTestScores != null && test.UserTestScores.Any())
                    {
                        var userScores = new List<UserTestScores>();
                        foreach (var score in test.UserTestScores)
                        {
                            userScores.Add(
                                new UserTestScores
                                {
                                    TestId = userTestModel.Id,
                                    Score = score.Score,
                                    ScoreType = score.ScoreType,
                                    ScoreInterpretation = score.ScoreInterpretation
                                });
                        }
                        _context.UserTestScores.AddRange(userScores);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            return Created();
        }

        // DELETE: api/UserTests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserTests(int id)
        {
            var userTests = await _context.UserTests.FindAsync(id);
            if (userTests == null)
            {
                return NotFound();
            }

            userTests.IsDeleted = true;

            _context.Entry(userTests).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserTestsExists(int id)
        {
            return _context.UserTests.Any(e => e.Id == id);
        }
    }

    public class Analytics
    {
        public string ScoreType { get; set; }
        public int Count { get; set; }
    }

    public class ScoreSummary
    {
        public string ScoreType { get; set; }
        public string ScoreInterpretation { get; set; }
        public int Count { get; set; }
    }
}