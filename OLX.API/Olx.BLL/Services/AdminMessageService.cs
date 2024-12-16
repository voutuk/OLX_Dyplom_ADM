using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;


namespace Olx.BLL.Services
{
    public class AdminMessageService(
        IRepository<AdminMessage> adminMessageRepo,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext,
        IValidator<AdminMessageCreationModel> validator,
        IMapper mapper
        ) : IAdminMessageService
    {
        public async Task<AdminMessageDto> UserCreate(AdminMessageCreationModel messageCreationModel)
        {
            validator.ValidateAndThrow(messageCreationModel);
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext,false);
            var message = mapper.Map<AdminMessage>(messageCreationModel);
            message.User = currentUser;
            currentUser.AdminMessages.Add(message);
            await userManager.UpdateAsync(currentUser);
            return mapper.Map<AdminMessageDto>(message);
        }

        public async Task Delete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetByIDAsync(id)
                ?? throw new HttpException(Errors.InvalidAdminMessageId,HttpStatusCode.BadRequest);
            adminMessageRepo.Delete(message);
            await adminMessageRepo.SaveAsync();
        }

        public async Task<IEnumerable<AdminMessageDto>> GetAdminMessages()
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetMessagesForAdmin());
            return messages.Any() ? mapper.Map<IEnumerable<AdminMessageDto>>(messages) : [];
            
        }

        public async Task<AdminMessageDto> GetById(int id)
        {
            var message = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetById(id))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            return  mapper.Map<AdminMessageDto>(message);
        }

        public async Task<IEnumerable<AdminMessageDto>> GetDeleted()
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetDeleted());
            return messages.Any() ? mapper.Map<IEnumerable<AdminMessageDto>>(messages) : [];
        }

        public async Task<IEnumerable<AdminMessageDto>> GetUserMessages()
        {
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetMessagesForUser(currentUser.Id));
            return messages.Any() ? mapper.Map<IEnumerable<AdminMessageDto>>(messages) : [];
        }

        public async Task SoftDelete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetById(id,true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            message.Deleted = true;
            await adminMessageRepo.SaveAsync();
        }

        public async Task<AdminMessageDto> AdminCreate(AdminMessageCreationModel messageCreationModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext, false);
            validator.ValidateAndThrow(messageCreationModel);
            var user = userManager.Users.FirstOrDefault(x => x.Id == messageCreationModel.UserId)
                ?? throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            var message = mapper.Map<AdminMessage>(messageCreationModel);
            message.FromAdmin = true;
            user.AdminMessages.Add(message);
            await userManager.UpdateAsync(user);
            return mapper.Map<AdminMessageDto>(message);
        }

        public async Task AdminCreateRange(AdminMessageCreationModel messageCreationModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext, false);
            validator.ValidateAndThrow(messageCreationModel);
            var message = mapper.Map<AdminMessage>(messageCreationModel);
            message.FromAdmin = true;
            List<AdminMessage> messages = [];
            if (messageCreationModel.UserIds is not null && messageCreationModel.UserIds.Any())
            {
                var usersIds = await userManager.Users.Where(x => messageCreationModel.UserIds.Contains(x.Id)).Select(x => x.Id).ToArrayAsync();
                if (usersIds.Length > 0)
                {
                    throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
                }
               
                foreach (var id in usersIds)
                {
                    message.UserId = id;
                    messages.Add(message);
                }
            }
           
            await adminMessageRepo.AddRangeAsync(messages);
            await adminMessageRepo.SaveAsync();
        }

        public async Task SetReaded(int id)
        {
            var user =  await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetUnreadedById(id, user.Id, true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            message.Readed = true;
            await adminMessageRepo.SaveAsync();
        }

        public async Task SetReaded(IEnumerable<int> ids)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetUnreadedByIds(user.Id, ids,  true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            foreach (var message in messages)
            {
                message.Readed = true;
            }
            await adminMessageRepo.SaveAsync();
        }
    }
}
