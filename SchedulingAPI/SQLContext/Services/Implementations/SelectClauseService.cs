using Common.Base;
using Common.Extensions;
using SQLContext.Helpers;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace SQLContext.Services.Implementations
{
    public class SelectClauseService : ISelectClauseService 
    {
        public SelectModel Select<T, TResult>(Expression<Func<T, TResult>> param, SelectModel selectModel) where T : class
        {
            var body = param.Body as NewExpression;
            var arguments = body.Arguments;
            foreach (var item in arguments)
            {
                if (item.NodeType == ExpressionType.Call)
                {
                    var unionContext = item.Invoke();
                    var unionSqlContext = (unionContext
                                            .GetType()
                                            .GetField("selectModel", BindingFlags.NonPublic | BindingFlags.Instance)
                                            .GetValue(unionContext) as SelectModel);
                    var memberName = body.Members.ElementAt(arguments.IndexOf(item)).Name;

                    unionSqlContext.SelectedColumns.InsertCol(
                        unionSqlContext.SelectedColumns.IndexOf(unionSqlContext.SelectedColumns.FirstOrDefault(x => x.Table == unionSqlContext.Table.Name)) + 1, 
                        unionSqlContext.Table.Name, 
                        unionSqlContext.Table.ForeignKey
                    );
                    selectModel.SubQueries.Add(
                        memberName,
                        unionSqlContext
                    );
                    continue;
                }
                var value = (item as MemberExpression);
                selectModel.Join(value.Expression as MemberExpression);

                var tableName = GetTableName(value.Expression.Type);
                if (tableName == selectModel.Table.Name)
                {
                    selectModel.SelectedColumns.InsertCol(0, tableName, value.Member.Name, value.Expression.Type);
                    continue;
                }
                selectModel.SelectedColumns.AddCol(tableName, value.Member.Name, value.Expression.Type);
            }
            selectModel.SelectedColumns.Select(c => new { c.Value, c.Table, c.TableType}).ToList().ForEach(c =>
            {
                if (!selectModel.SelectedColumns.Any(x => x.Table == c.Table && x.IsPrimaryKey))
                    selectModel.SelectedColumns.InsertPrimaryCol(
                        selectModel.SelectedColumns.IndexOf(selectModel.SelectedColumns.FirstOrDefault(x => x.Table == c.Table)),
                        c.Table,
                        KeyHelper.GetPrimaryKey(c.TableType));
            });
            return selectModel;
        }
        private string GetTableName(Type type)
        {
            var attribute = type.CustomAttributes.Where(x => x.AttributeType == typeof(TableAttribute)).FirstOrDefault();
            if (attribute == null)
                return type.Name;
            return attribute.ConstructorArguments.FirstOrDefault().Value.ToString();
        }
    }
}
