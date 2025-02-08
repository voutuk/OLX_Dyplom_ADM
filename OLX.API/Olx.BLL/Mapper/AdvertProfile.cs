using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Models.Advert;


namespace Olx.BLL.Mapper
{
    public class AdvertProfile :Profile
    {
        public AdvertProfile()
        {
            CreateMap<AdvertCreationModel,Advert>();
            CreateMap<Advert, AdvertDto>()
                .ForMember(x => x.SettlementName, opt => opt.MapFrom(x => x.Settlement.Description))
                .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Category.Name));
        }
    }
}
