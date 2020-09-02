using CodebookManagement.Attributes;
using Entity.Base;

namespace CodebookManagement.Models
{
    public class CodebookPaging : BasePaging
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int UserId { get; set; }
        public int Id { get; set; }
        public CodebookPaging Process(int userId)
        {
            UserId = userId;
            return this;
        }
        public CodebookPaging Process(int id, int userId)
        {
            Id = id;
            UserId = userId;
            return this;
        }
    }
}
