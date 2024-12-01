using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilterValuesController(IFilterValueService filterValueService) : ControllerBase
    {
        [HttpGet("get")]
        public async Task<IActionResult> GetAll() => Ok(await filterValueService.GetAllAsync());

        [HttpPost("range")]
        public async Task<IActionResult> GetAll([FromBody] IEnumerable<int> ids) => Ok(await filterValueService.GetDtoByIdsAsync(ids));

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromQuery] string name)
        {
            await filterValueService.CreateAsync(name);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create/range")]
        public async Task<IActionResult> CreateRange([FromBody] IEnumerable<string> names)
        {
            await filterValueService.CreateAsync(names);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await filterValueService.RemoveAsync(id);
            return Ok();
        }
    }
}
