using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CompanyManagement.Models
{
    public class Company
    {
        public Guid? CompanyId { get; set; }
        [Required(ErrorMessage = "name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "logo_required")]
        public int? FileId { get; set; }
        public string Logo { get; set; }
    }
}
