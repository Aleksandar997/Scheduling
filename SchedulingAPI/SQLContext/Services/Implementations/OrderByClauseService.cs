using Entity.Base;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace SQLContext.Services.Implementations
{
    public class OrderByClauseService : IOrderByClauseService
    {
        StringBuilder sb = new StringBuilder();
        public OrderByClauseModel OrderBy(BasePaging paging) =>
            new OrderByClauseModel(
              paging.SortBy != null ?
              sb
                 .Append(string.Format("ORDER BY {0} {1}", paging.SortBy.Split(".").Select(x => $"[{x}]"),
                     (paging.SortOrder == SortOrder.Ascending ? "ASC" : "DESC"))
                  )
                 .Append(string.Format("OFFSET {0} ROWS", paging.Skip))
                 .Append(paging.Take != null ? string.Format("FETCH NEXT {0} ROWS ONLY", paging.Take) : null).ToString()
             : null
             );
    }
}
