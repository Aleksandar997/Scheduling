using CodebookManagement.Attributes;
using CodebookManagement.Models;
using CompanyManagement.Models;
using Entity.Base;
using SQLContext.Models;
using System.ComponentModel.DataAnnotations.Schema;
using UserManagement.Models;
using ColumnAttribute = CodebookManagement.Attributes.ColumnAttribute;

namespace SchedulingAPI.Models
{
    public class OrganizationUnit : ICodebook
    {
        [Column(false)]
        [PrimaryKey]
        public int OrganizationUnitId { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        [Column(ControlType.Input, true)]
        public string Code { get; set; }
        [Column(ControlType.Input, true)]
        public string Name { get; set; }
        [Column(ControlType.Toggle, true)]
        public bool Active { get; set; }
        [Join(JoinType.Inner, "CompanyId", "CompanyId")]
        public User User { get; set; }
        public int? Id => OrganizationUnitId;
        public OrganizationUnit(int organizationUnitId, string code, string name, bool active, long? userId) { }
        public OrganizationUnit() { }
    }

    public class OrganizationUnitPaging : CodebookPaging
    {
        public long OrganizationUnitId { get; set; }
    }
}