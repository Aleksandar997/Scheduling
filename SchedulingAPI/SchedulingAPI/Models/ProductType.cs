using CodebookManagement.Attributes;
using CodebookManagement.Models;
using SQLContext.Models;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Attributes;
using ColumnAttribute = CodebookManagement.Attributes.ColumnAttribute;

namespace SchedulingAPI.Models
{
    public class ProductType : ICodebook
    {
        [PrimaryKey]
        [Column(false)]
        public int ProductTypeId { get; set; }
        [Column(ControlType.Input, true)]
        public string Name { get; set; }
        public int? Id => ProductTypeId;
        //[Column(ControlType.Input)]
        //public string Code { get; set; }
        [Column(ControlType.Toggle, true)]
        public bool Active { get; set; }
        public string Code { get; set; }
        public Guid CompanyId { get; set; }
        [Join(JoinType.Inner, "CompanyId", "CompanyId")]
        [ChildValidation()]
        public User User { get; set; }

        public ProductType(int productTypeId, string name, bool active, long? userId)
        {
            ProductTypeId = productTypeId;
            Name = name;
            Active = active;
        }
        public ProductType(string name, bool active)
        {

        }
        public ProductType() { }
    }
}