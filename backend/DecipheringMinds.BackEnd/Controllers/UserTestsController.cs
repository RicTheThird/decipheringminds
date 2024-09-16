using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
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
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserTests>>> GetUserTestsByUserId(int userId)
        {
            var userTests = await _context.UserTests
                .Where(u => u.UserId == userId && !u.IsDeleted)
                .Include(u => u.UserTestScores).ToListAsync();

            if (userTests == null)
            {
                return NotFound();
            }

            return userTests;
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<UserTests>>> GetMyUserTests()
        {
            var userTests = await _context.UserTests
                .Where(u => u.UserId == GetUserId() && !u.IsDeleted)
                .Include(u => u.UserTestScores).ToListAsync();

            if (userTests == null)
            {
                return NotFound();
            }

            return userTests;
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

        // POST: api/UserTests
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<UserTests>> PostUserTests(UserTests userTests)
        {
            var userTestModel = new UserTests
            {
                UserId = GetUserId(),
                TestId = userTests.TestId,
                IsDeleted = false,
                IsPublished = false,
                CreatedAt = DateTime.Now
            };

            _context.UserTests.Add(userTestModel);
            await _context.SaveChangesAsync();

            var userScores = new List<UserTestScores>();

            foreach (var score in userTests.UserTestScores)
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

            return CreatedAtAction("GetUserTests", new { id = userTestModel.Id }, userTestModel);
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
}