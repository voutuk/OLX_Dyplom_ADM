using AutoMapper;
using Olx.BLL.Entities;
using Olx.BLL.Models.User;

namespace Olx.BLL.Mapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserCreationModel, OlxUser>()
                .ForMember(x=>x.UserName,opt=>opt.MapFrom(x=>x.Email));
        }
    }
}
