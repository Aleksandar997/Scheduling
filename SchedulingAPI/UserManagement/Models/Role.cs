using CodebookManagement.Attributes;
using CodebookManagement.Models;
using SQLContext.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Attributes;
using ColumnAttribute = CodebookManagement.Attributes.ColumnAttribute;

namespace UserManagement.Models
{
    public class Role : ICodebook
    {
        [PrimaryKey]
        public int RoleId { get; set; }
        [Column(ControlType.Input, true)]
        public string Code { get; set; }
        [Column(ControlType.Input, true)]
        public string Name { get; set; }
        [Column(ControlType.Toggle, true)]
        public bool Active { get; set; }
        public int UserId { get; set; }

        public int? Id => RoleId;

        public IEnumerable<Menu> Menus { get; set; }
        public IEnumerable<Permission> Permissions { get; set; }

        [Join(JoinType.Inner, "CompanyId", "CompanyId")]
        [ChildValidation()]
        public User User { get; set; } = new User();

        public Role(string code, string name, bool active, long? userId) { }
        public Role() { }
    }
}
