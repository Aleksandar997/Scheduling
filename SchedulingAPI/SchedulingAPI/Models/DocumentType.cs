using System.ComponentModel.DataAnnotations.Schema;

namespace SchedulingAPI.Models
{
    public class DocumentType
    {
        [PrimaryKey]
        public int DocumentTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string CodePath { get; set; }
    }
}