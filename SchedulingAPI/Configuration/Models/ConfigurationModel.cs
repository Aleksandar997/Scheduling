using Common.Extensions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Configuration.Models
{
    [Table("Configuration")]
    public class ConfigurationModel : ITreeview<ConfigurationModel>
    {
        [PrimaryKey]
        public int? ConfigurationId { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public int? ParentId { get; set; }
        public string Path { get; set; }
        public Test Test { get; set; }
        [ForeignKey("Test")]
        public int TestId { get; set; }
        public List<ConfigurationModel> Children { get; set; } = new List<ConfigurationModel>();
    }
    public class Test
    {
        [PrimaryKey]
        public int TestId { get; set; }
        public Testt Testt { get; set; }
        [ForeignKey("Testt")]
        public int TesttId { get; set; }
    }

    public class Testt
    {
        [PrimaryKey]
        public int TestId { get; set; }
        public Testtt Testtt { get; set; }
    }

    public class Testtt
    {
        public string name { get; set; }
        [PrimaryKey]
        public int TestIddd { get; set; }
    }

}
