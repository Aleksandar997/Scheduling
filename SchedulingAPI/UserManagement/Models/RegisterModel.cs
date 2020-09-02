using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace UserManagement.Models
{
    public class RegisterModel
    {
        public License License { get; set; }
        public User User { get; set; }
    }

    public class License
    {
        [Required(ErrorMessage = "license_required")]
        public Guid? Value { get; set; }
    }
}
