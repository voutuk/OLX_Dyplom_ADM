using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Models;

namespace Olx.BLL.Mapper
{
    public class AdminMessageProfile : Profile
    {
        public AdminMessageProfile()
        {
            CreateMap<AdminMessageCreationModel, AdminMessage>();
            CreateMap<AdminMessage, AdminMessageDto>()
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.User.FirstName ?? x.User.LastName ?? x.User.Email));
        }
    }
}
