using Entity.Base;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SQLContext.Services.Interfaces
{
    public interface IOrderByClauseService
    {
        OrderByClauseModel OrderBy(BasePaging paging);
    }
}
