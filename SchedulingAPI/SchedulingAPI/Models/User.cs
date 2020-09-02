using Common.Attributes;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sysUser = UserManagement.Models.User;

namespace SchedulingAPI.Models
{
    public class User : sysUser
    {
        public Employee Employee { get; set; }
        public DateTime sysDTCreated { get; set; }
        public string RoleNames { get; set; }
        public User()
        {
            Employee = new Employee();
        }

        public User(Guid companyId)
        {
            CompanyId = companyId;
        }

    }
    public class UserPaging : BasePaging
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
