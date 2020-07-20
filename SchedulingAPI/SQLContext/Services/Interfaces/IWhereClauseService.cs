using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace SQLContext.Services.Interfaces
{
    public interface IWhereClauseService
    {
        WhereClauseModel Where<T>(Expression<Func<T, bool>> param) where T : class;
    }
}
