using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Models
{
    public class Permission
    {
        [PrimaryKey]
        public int PermissionId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public bool Active { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
    }
}
