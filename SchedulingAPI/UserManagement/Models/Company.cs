using System;
using System.Collections.Generic;
using System.Text;

namespace UserManagement.Models
{
    public class Company
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
    }
}
