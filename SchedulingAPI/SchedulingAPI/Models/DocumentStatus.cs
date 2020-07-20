using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Models
{
    public class DocumentStatus
    {
        [PrimaryKey]
        public int DocumentStatusId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }
}
