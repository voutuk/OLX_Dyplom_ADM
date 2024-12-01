
using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Models;

namespace Olx.BLL.Mapper
{
    public class FilterProfile : Profile
    {
        public FilterProfile()
        {
            CreateMap<Filter, FilterDto>();
            CreateMap<FilterCreationModel, Filter>();
        }
    }
}
