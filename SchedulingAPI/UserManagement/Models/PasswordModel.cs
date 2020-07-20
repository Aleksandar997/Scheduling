﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace UserManagement.Models
{
    public class PasswordModel
    {
        public int? UserId { get; set; }

        [Required(ErrorMessage = "username_required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "password_required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "new_password_required")]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "notsame_pass")]
        [Required(ErrorMessage = "user_password_required")]
        public string NewPasswordRepeat { get; set; }

        [Required(ErrorMessage = "email_required")]
        public string Email { get; set; }

        public PasswordModel(string userName, string email, string newPassword)
        {
            UserName = userName;
            Email = email;
            NewPassword = newPassword;
        }
        public PasswordModel() { }
    }

    public class UserCredentials
    {
        [Required(ErrorMessage = "username_required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "email_required")]
        public string Email { get; set; }

        public string NewPassword { get; set; }
    }
}