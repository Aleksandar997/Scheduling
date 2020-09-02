using CodebookManagement.Attributes;
using CodebookManagement.Models;
using SQLContext.Models;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Attributes;
using ColumnAttribute = CodebookManagement.Attributes.ColumnAttribute;

namespace SchedulingAPI.Models
{
    public class DocumentType : ICodebook
    {
        [PrimaryKey]
        [Column(false)]
        public int DocumentTypeId { get; set; }
        [Column(ControlType.Input, false)]
        public string Name { get; set; }
        [Column(ControlType.Input, false)]
        public string Code { get; set; }
        public string CodePath { get; set; }
        [Join(JoinType.Inner, "DocumentTypeId", "DocumentTypeId")]
        public DocumentTypeCompany DocumentTypeCompany { get; set; }
        public int? Id => DocumentTypeId;
        public DocumentType(int documentTypeId, string name, string code, int year, int defaultNumber, long? userId)
        {
            DocumentTypeId = documentTypeId;
            Name = name;
            Code = code;
            DocumentTypeCompany = new DocumentTypeCompany(year, defaultNumber);
        }

        public DocumentType(int documentTypeId)
        {
            DocumentTypeId = documentTypeId;
        }
        public DocumentType(int year, int defaultNumber)
        {
            DocumentTypeCompany = new DocumentTypeCompany(year, defaultNumber);
        }

        public DocumentType() { }
    }
    public class DocumentTypeCompany
    {
        [PrimaryKey]
        public int DocumentTypeCompanyId { get; set; }
        //[Column(false)]
        public Guid CompanyId { get; set; }
        public int DocumentTypeId { get; set; }
        [Column(ControlType.NumberInput, true)]
        public int Year { get; set; }
        [Column(ControlType.NumberInput, true)]
        public int DefaultNumber { get; set; }
        [Join(JoinType.Inner, "CompanyId", "CompanyId")]
        [ChildValidation()]
        public User User { get; set; } = new User();
        public DocumentTypeCompany(int documentTypeId)
        {
            DocumentTypeId = documentTypeId;
        }
        public DocumentTypeCompany(Guid companyId)
        {
            CompanyId = companyId;
        }
        public DocumentTypeCompany(int year, int defaultNumber)
        {
            Year = year;
            DefaultNumber = defaultNumber;
        }
        public DocumentTypeCompany() { }
    }

}