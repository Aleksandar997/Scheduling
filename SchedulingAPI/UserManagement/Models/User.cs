using Common.Extensions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Models
{
    public class User
    {
        [PrimaryKey]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public bool IsAdmin { get; set; }
        public Company Company { get; set; }
        private List<Menu> menus;
        public List<Menu> Menus
        {
            get => menus;
            set => menus = value.ToTreeView(x => x.MenuId);
        }
        public List<Role> Roles { get; set; }
        public List<Permission> Permissions { get; set; }
        public User()
        {
            Menus = new List<Menu>();
            Roles = new List<Role>();
            Permissions = new List<Permission>();
        }
    }
}
