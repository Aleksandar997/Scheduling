using System.ComponentModel.DataAnnotations.Schema;
using UserManagement.Models;

namespace SchedulingAPI.Models
{
    public class Employee
    {
        [PrimaryKey]
        public int? EmployeeId { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public string IdentificationNumber { get; set; }
        public bool Active { get; set; }
    }
}
