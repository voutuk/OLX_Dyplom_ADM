using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities.FilterEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Olx.BLL.Mapper
{
    public class FilterValueProfile : Profile
    {
        public FilterValueProfile()
        {
            CreateMap<FilterValue, FilterValueDto>();
        }
    }
}

