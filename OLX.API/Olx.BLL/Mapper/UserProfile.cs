using AutoMapper;
using Olx.BLL.Entities;
using Olx.BLL.Helpers;
using Olx.BLL.Models.User;

namespace Olx.BLL.Mapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserCreationModel, OlxUser>()
                .ForMember(x=>x.UserName,opt=>opt.MapFrom(x=>x.Email));

            CreateMap<GoogleUserInfo, OlxUser>()
                .ForMember(x => x.FirstName, opt => opt.MapFrom(x => x.Given_Name))
                .ForMember(x => x.LastName, opt => opt.MapFrom(x => x.Family_Name))
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.Email, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.EmailConfirmed, opt => opt.MapFrom(x => x.Email_Verified));
        }
    }
}
