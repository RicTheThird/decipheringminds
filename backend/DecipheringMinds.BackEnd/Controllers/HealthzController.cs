using DecipheringMinds.BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DecipheringMinds.BackEnd.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthzController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<HealthzController> _logger;
        private readonly ApplicationDbContext _context;

        public HealthzController(ILogger<HealthzController> logger, ApplicationDbContext context)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response = await _context.Users.Where(u => u.Role == "Customer").ToListAsync();
            return response.Any() ? Ok() : BadRequest();
        }
    }
}