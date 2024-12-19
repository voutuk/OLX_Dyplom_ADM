
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.Entities
{
    public class Category : BaseNamedEntity
    {
        [StringLength(100)]
        [Unicode(false)]
        public string? Image { get; set; }
        public int? ParentId { get; set; }
        public Category? Parent { get; set; }
        public ICollection<Category> Childs { get; set; } = new HashSet<Category>();
        public ICollection<Filter> Filters { get; set; } = new HashSet<Filter>();
        public ICollection<Advert> Adverts { get; set; } = new HashSet<Advert>();
    }
}
