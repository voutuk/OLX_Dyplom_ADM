using Microsoft.AspNetCore.Mvc;

namespace OLX.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        [HttpPost("test")]
        public IActionResult Test([FromBody] TestModel model )
        {
            return Ok(model);
        }
    }
}
public class TestModel 
{
    public DateTime Time { get; set; }
    public double Double { get; set; }
}