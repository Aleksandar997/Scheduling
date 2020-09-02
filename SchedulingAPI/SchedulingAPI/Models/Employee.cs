using Common.Attributes;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Models
{
    public class Employee
    {
        public int? EmployeeId { get; set; }
        [ConditionalRequired("IsEmployee;true", "identificationNumber_required")]
        public string IdentificationNumber { get; set; }
        public bool Active { get; set; }
        [ConditionalRequired("IsEmployee;true", "organization_units_required")]
        public List<int> OrganizationUnits { get; set; } 
        [ConditionalRequired("IsEmployee;true", "products_required")]
        public List<long> Products { get; set; }
        public bool IsEmployee { get; set; }

        public Employee()
        {
            OrganizationUnits = new List<int>();
            Products = new List<long>();
        }
    }
}
