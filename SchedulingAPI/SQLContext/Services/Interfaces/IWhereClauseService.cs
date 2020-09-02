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
        WhereClauseModel Where<T, T2>(Expression<Func<T, T2, bool>> param) where T : class;
    }
}
