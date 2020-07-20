using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Models
{
    public class Role
    {
        [PrimaryKey]
        public int RoleId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public int UserId { get; set; }
    }
}
