using SQLContext.Extensions;
using SQLContext.Helpers;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;

namespace SQLContext.Services.Implementations
{
    public class JoinClauseService : IJoinClauseService
    {
        public JoinModel Join<T, JoinTable>(Expression<Func<T, object>> baseTable, Expression<Func<JoinTable, object>> joinTable, TableModel table, JoinType joinType)
        {
            var joinedTable = joinTable.Parameters.FirstOrDefault().Type;
            var parentColumn = ((baseTable.Body as UnaryExpression).Operand as MemberExpression).Member.Name;
            var childColumn = ((joinTable.Body as UnaryExpression).Operand as MemberExpression).Member.Name;
            return JoinModelFactory.Initialize(
                joinType, table.Name, joinedTable.GetTableName(), parentColumn, childColumn, joinedTable
            );
        }
    }
}
