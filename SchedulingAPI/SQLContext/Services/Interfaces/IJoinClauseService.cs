using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace SQLContext.Services.Interfaces
{
    public interface IJoinClauseService
    {
        JoinModel Join<T, JoinTable>(Expression<Func<T, object>> baseTable, Expression<Func<JoinTable, object>> joinTable, TableModel table, JoinType joinType);
    }
}
