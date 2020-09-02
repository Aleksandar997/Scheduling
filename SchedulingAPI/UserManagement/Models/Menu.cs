using Common.Extensions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Models
{
    public class Menu : ITreeview<Menu>
    {
        [PrimaryKey]
        public int MenuId { get; set; }
        public int? ParentId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Image { get; set; }
        public int Sort { get; set; }
        public bool Active { get; set; }
        public int NotificationCount { get; set; } = 0;
        [ForeignKey("User")]
        public int UserId { get; set; }
        public List<Role> Role { get; set; }
        public List<Menu> Children { get; set; }

        public Menu()
        {
            Children = new List<Menu>();
            Role = new List<Role>();
        }
    }
}
