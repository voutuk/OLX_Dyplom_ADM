using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        [HttpGet("get")]
        public async Task<IActionResult> GetAll() => Ok(await categoryService.GetAllAsync());

        [HttpGet("get/main")]
        public async Task<IActionResult> GetMain() => Ok(await categoryService.GetMainAsync());

        [HttpGet("get/tree")]
        public async Task<IActionResult> GetMainTree() => Ok(await categoryService.GetMainTreeAsync());

        [HttpGet("get/tree/{id:int}")]
        public async Task<IActionResult> GetTree([FromRoute]int id) => Ok(await categoryService.GetTreeAsync(id));

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromForm] CategoryCreationModel categoryEditModel)
        {
            await categoryService.EditAsync(categoryEditModel);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromForm] CategoryCreationModel categoryCreationModel)
        {
            await categoryService.CreateAsync(categoryCreationModel);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await categoryService.RemoveAsync(id);
            return Ok();
        }
    }
}
