using System.Data.SqlClient;

namespace Entity.Base
{
    public class BasePaging
    {
        public string SortBy { get; set; }
        public SortOrder SortOrder { get; set; }
        public int Skip { get; set; }
        public int? Take { get; set; }
        public string Filter { get; set; }

        public virtual object GetAnonFilterObject()
        {
            return null;
        }
    }
}
