using System.ComponentModel.DataAnnotations.Schema;
using UserManagement.Models;

namespace SchedulingAPI.Models
{
    public class OrganizationUnit
    {
        public long OrganizationUnitId { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
    }
}