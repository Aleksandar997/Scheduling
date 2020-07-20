using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchedulingAPI.Models
{
    public class Customer
    {
        [PrimaryKey]
        public long? CustomerId { get; set; }
        //[Required(ErrorMessage = "first_name_required")]
        public string FirstName { get; set; }
        //[Required(ErrorMessage = "last_name_required")]
        public string LastName { get; set; }
        public string CustomerName => $"{FirstName} {LastName}";
        //[Required(ErrorMessage = "phone_number_required")]
        public string PhoneNumber { get; set; }
    }
}
