using Common.Extensions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Models
{
    public class Permission : ITreeview<Permission>
    {
        [PrimaryKey]
        public int PermissionId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? ParentId { get; set; }
        public bool Active { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public List<Permission> Children { get; set; }

        public Permission()
        {
            Children = new List<Permission>();
        }
    }
}
