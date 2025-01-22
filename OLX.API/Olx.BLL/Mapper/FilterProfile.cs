using AutoMapper;
using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Models.FilterModels;


namespace Olx.BLL.Mapper
{
    public class FilterProfile : Profile
    {
        public FilterProfile()
        {
            CreateMap<FilterEditModel, Filter>();
            CreateMap<Filter,FilterDto> ()
                .ForMember(x => x.Categories, opt => opt.MapFrom(z => z.Categories.Select(y => y.Id)));
            CreateMap<FilterCreationModel, Filter>()
                .ForMember(x => x.Values, opt => opt.MapFrom(z => z.Values.Select(y => new FilterValue() { Value = y })));
            
        }
    }
}
