using System.ComponentModel.DataAnnotations.Schema;

namespace SchedulingAPI.Models
{
    public class DocumentDetail
    {
        [PrimaryKey]
        public long? DocumentDetailId { get; set; }
        public int? DocumentId { get; set; }
        public int? ProductId { get; set; }
        public Product Product { get; set; }
        public int? Quantity { get; set; }
        public decimal? Discount { get; set; }
        public decimal? PriceWithDiscount => Price * (1 - (Discount ?? 0) / 100);
        public decimal? Price { get; set; }
        public int? EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
