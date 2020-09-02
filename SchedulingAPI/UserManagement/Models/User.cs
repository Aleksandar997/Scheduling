using CodebookManagement.Attributes;
using Common.Attributes;
using Common.Extensions;
using CompanyManagement.Models;
using Configuration.Models;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using ColumnAttribute = CodebookManagement.Attributes.ColumnAttribute;

namespace UserManagement.Models
{
    public class User
    {
        [PrimaryKey]
        [Column(false)]
        public long? UserId { get; set; }
        [Required(ErrorMessage = "username_required")]
        public string UserName { get; set; }
        [ConditionalRequired("IsUserSave;false", "password_required")]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "passwords_dont_match")]
        [ConditionalRequired("IsUserSave;false", "password_repeat_required")]
        public string PasswordRepeat { get; set; }
        [Required(ErrorMessage = "first_name_required")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "last_name_required")]
        public string LastName { get; set; }
        [ConditionalRequired("IsUserSave;true", "email_required")]
        public string Email { get; set; }
        [ConditionalRequired("IsUserSave;true", "active_required")]
        public bool Active { get; set; }
        public Guid CompanyId { get; set; }
        public Company Company { get; set; }
        private List<Menu> menus;
        public List<Menu> Menus
        {
            get => menus;
            set {
                menus = value.ToTreeView(x => x.MenuId, x => x.OrderBy(y => y.Sort).ToList());
            }
        }

        [ConditionalRequired("IsUserSave;true", "roles_required")]
        public List<Role> Roles { get; set; }
        public List<Permission> Permissions { get; set; }

        public bool IsUserSave { get; set; } = false;
        public bool IsAdmin { get; set; }
        public int? EmployeeId { get; set; }
        public IEnumerable<ChartMetaData> ChartMetaData { get; set; }
        public Theme Theme { get; set; }
    }

    public class ChartMetaData
    {
        public string Component { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public string Name { get; set; }
        public int Height { get; set; }
    }
}
