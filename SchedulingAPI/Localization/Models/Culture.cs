using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Localization.Models
{
    public class Culture
    {
        [PrimaryKey]
        public int? CultureId { get; set; }
        public string Name { get; set; }
        public string Flag { get; set; }
        public string Value { get; set; }
        public bool Active { get; set; }
        public Dictionary<string, string> LocalizationPair { get; set; }
        //public IEnumerable<TranslateModel> Translate { get; set; } = new List<TranslateModel>();

        public Culture() {  }

        public Culture(string name, string value, string flag)
        {
            Name = name;
            Value = value;
            Flag = flag;
        }

        public Culture Clear()
        {
            return new Culture();
        }
    }
}
