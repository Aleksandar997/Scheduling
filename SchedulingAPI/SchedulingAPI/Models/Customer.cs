using CodebookManagement.Attributes;
using CodebookManagement.Models;
using Entity.Base;
using SQLContext.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ColumnAttribute = CodebookManagement.Attributes.ColumnAttribute;

namespace SchedulingAPI.Models
{
    public class Customer : ICodebook
    {
        [PrimaryKey]
        [Column(false)]
        public int? CustomerId { get; set; }
        //[Required(ErrorMessage = "first_name_required")]
        [Column(ControlType.Input, false)]
        public string FirstName { get; set; }
        //[Required(ErrorMessage = "last_name_required")]
        [Column(ControlType.Input, false)]
        public string LastName { get; set; }
        public string CustomerName => $"{FirstName} {LastName}";
        //[Required(ErrorMessage = "phone_number_required")]
        [Column(ControlType.Input, false)]
        public string PhoneNumber { get; set; }
        public Guid CompanyId { get; set; }
        [Join(JoinType.Inner, "CompanyId", "CompanyId")]
        public User User { get; set; }
        public int? Id => CustomerId;

        public Customer(int? customerId, string firstName, string lastName, string phoneNumber, long? userId) { }

        public Customer() { }
    }

    public class CustomerPaging : CodebookPaging
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
    }
}
