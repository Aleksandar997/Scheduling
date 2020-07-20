using System.ComponentModel.DataAnnotations.Schema;

namespace SchedulingAPI.Models
{
    public class ProductType
    {
        [PrimaryKey]
        public int ProductTypeId { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
    }
}