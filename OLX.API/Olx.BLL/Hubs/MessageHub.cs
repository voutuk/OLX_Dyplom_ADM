using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Olx.BLL.Entities;
using Olx.BLL.Helpers;
namespace OLX.API.Hubs
{
    [Authorize]
    public class MessageHub(UserManager<OlxUser> userManager) :Hub 
    {
        //public async Task Connect() 
        //{
        //    var userName = Context.User?.Identity?.Name
        //    ?? throw new Exception();
        //    var user = await userManager.FindByNameAsync(userName)
        //        ??  throw new Exception();

        //    if (await userManager.IsInRoleAsync(user, Roles.Admin))
        //    {
        //        await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        //    }
        //    else 
        //    {
        //        await Groups.AddToGroupAsync(Context.ConnectionId, "Users");
        //    }
        //}
    }
}
