using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Page;
using Olx.BLL.Models.User;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;

namespace Olx.BLL.Services
{
    public class UserService(
        UserManager<OlxUser> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        IRepository<IdentityUserRole<int>> userRolesRepo,
        IRepository<OlxUser> userRepo,
        IMapper mapper) : IUserService
    {
        private async Task<IEnumerable<int>> _getAdminsIds() 
        {
            var adminRole = await roleManager.FindByNameAsync(Roles.Admin) 
                ?? throw new HttpException(Errors.InvalidRole,HttpStatusCode.InternalServerError);
            var adminIds = userRolesRepo.GetQuery()
                .Where(x => x.RoleId == adminRole.Id)
                .Select(z => z.UserId);
            return adminIds;
        }

        public async Task<IEnumerable<OlxUserDto>> Get(bool isAdmin = false) 
        {
            var adminsIds = await _getAdminsIds();
            var users = await userRepo.GetListBySpec(
                isAdmin
                ? new OlxUserSpecs.GetByIds(adminsIds, UserOpt.Settlement | UserOpt.NoTracking | UserOpt.Adverts | UserOpt.FavoriteAdverts)
                : new OlxUserSpecs.GetExcludIds(adminsIds, UserOpt.Settlement | UserOpt.NoTracking | UserOpt.Adverts | UserOpt.FavoriteAdverts));
            return mapper.Map<IEnumerable<OlxUserDto>>(users);
        } 

        public async Task<OlxUserDto> Get(int id, bool isAdmin = false) 
        {
            var user = await  userRepo.GetItemBySpec(new OlxUserSpecs.GetById(id, UserOpt.Settlement | UserOpt.NoTracking | UserOpt.Adverts | UserOpt.FavoriteAdverts));
            if (user == null || !(await userManager.IsInRoleAsync(user, Roles.Admin) ^ !isAdmin))
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }
            return mapper.Map<OlxUserDto>(user);
        }
        

        public async Task<PageResponse<OlxUserDto>> Get(UserPageRequest userPageRequest, bool isAdmin = false)
        {
            var adminsIds = await _getAdminsIds();
            var query = userRepo.GetQuery()
                .Where(x => adminsIds.Any(z => z == x.Id == isAdmin))
                .AsNoTracking()
                .Include(x => x.Settlement)
                .Include(x => x.Adverts)
                .Include(x => x.FavoriteAdverts);
            var paginationBuilder = new PaginationBuilder<OlxUser>(query);
            var userFilter = mapper.Map<OlxUserFilter>(userPageRequest);
            var sortData = new OlxUserSortData(userPageRequest.IsDescending,userPageRequest.SortIndex);
            var page = await paginationBuilder.GetPageAsync(userPageRequest.Page,userPageRequest.Size,userFilter,sortData);
            return new()
            {
                Total = page.Total,
                Items = mapper.Map<IEnumerable<OlxUserDto>>(page.Items)
                
            };
        }
    }
}
