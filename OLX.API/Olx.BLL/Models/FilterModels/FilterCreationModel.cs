using AutoMapper;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.Models.FilterModels
{
    [AutoMap(typeof(Filter))]
    public class FilterCreationModel
    {
        public int Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public IEnumerable<string>? NewValues { get; init; }
        public IEnumerable<int>? ValuesIds { get; init; }
    }
}
