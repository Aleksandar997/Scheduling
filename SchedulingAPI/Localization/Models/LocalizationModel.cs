using Entity.Base;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Localization.Models
{
    [Table("Translate")]
    public class TranslateModel
    {
        [PrimaryKey]
        public int? TranslateId { get; set; }
        public int? CultureId { get; set; }
        public int? ResourceId { get; set; }
        public string Value { get; set; }
        public Resource Resource { get; set; } = new Resource();
        public Culture Culture { get; set; } = new Culture();
    }
    public class Resource
    {
        [PrimaryKey]
        public int? ResourceId { get; set; }
        public string Name { get; set; }
        public IEnumerable<TranslateModel> Translates { get; set; }

    }
    public class ResourcePaging : BasePaging
    {
        public string Resource { get; set; }
    }
}
