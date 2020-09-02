using Entity.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Web.Attributes;

namespace SchedulingAPI.Models
{
    public class Schedule
    {
        [PrimaryKey]
        public long? ScheduleId { get; set; }
        //[Required(ErrorMessage = "phone_number_required")]
        public string PhoneNumber { get; set; }
        //[Required(ErrorMessage = "date_required")]
        public DateTime Date { get; set; }
        //[Required(ErrorMessage = "customer_required")]
        public long? CustomerId { get; set; }
        public string Employees { get; set; }
        //[ChildValidation]
        public Customer Customer { get; set; } = new Customer();
        public bool BindToEmployee { get; set; }
    }

    public class SchedulePaging
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public List<int> Employees = new List<int>();
        public List<int> OrganizationUnits = new List<int>();
    }

    public class ScheduleOnDayPaging: BasePaging
    {
        public DateTime Date { get; set; }
    }
}
