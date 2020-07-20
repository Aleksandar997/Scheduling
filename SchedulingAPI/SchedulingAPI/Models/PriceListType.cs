using System.ComponentModel.DataAnnotations.Schema;

namespace SchedulingAPI.Models
{
    public class PricelistType
    {
        [PrimaryKey]
        public int PricelistTypeId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
    }
}