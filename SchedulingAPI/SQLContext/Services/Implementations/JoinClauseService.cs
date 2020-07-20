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
            switch (joinType)
            {
                case JoinType.Inner:
                    return new InnerJoinModel(
                          table.Name,
                          GetTableName(joinedTable),
                          parentColumn,
                          childColumn,
                          joinedTable
                      );
                case JoinType.Left:
                    return new LeftJoinModel(
                        table.Name,
                        GetTableName(joinedTable),
                        parentColumn,
                        childColumn,
                        joinedTable
                    );
                case JoinType.Right:
                    return new RightJoinModel(
                        table.Name,
                        GetTableName(joinedTable),
                        parentColumn,
                        childColumn,
                        joinedTable
                    );
                case JoinType.Full:
                    return new FullJoinModel(
                        table.Name,
                        GetTableName(joinedTable),
                        parentColumn,
                        childColumn,
                        joinedTable
                    );
                default:
                    return null;
            }
        }

        private string GetTableName(Type type)
        {
            var parentTable = type.Name;
            var attribute = type.CustomAttributes.Where(x => x.AttributeType == typeof(TableAttribute)).FirstOrDefault();
            if (attribute != null)
                parentTable = attribute.ConstructorArguments.FirstOrDefault().Value.ToString();
            return parentTable;
        }

    }
}
