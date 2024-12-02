using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Models;


namespace Olx.BLL.Mapper
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CategoryDto>()
                .ForMember(x=>x.Childs,opt=>opt.MapFrom(z=>z.Childs.Select(y=>y.Id)))
                .ForMember(x=>x.Filters,opt => opt.MapFrom(z => z.Filters.Select(y => y.Id)));
            CreateMap<CategoryCreationModel, Category>();
        }
    }
}
