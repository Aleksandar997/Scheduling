using Entity.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Web.Attributes;

namespace SchedulingAPI.Models
{
    public class Schedule
    {
        [PrimaryKey]
        public long? ScheduleId { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Date { get; set; }
        public long? CustomerId { get; set; }
        public int? EmployeeId { get; set; }
        public string Employees { get; set; }
        //[ChildValidation]
        public Customer Customer { get; set; } = new Customer();
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
