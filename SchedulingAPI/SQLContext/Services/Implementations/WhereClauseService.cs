using Common.Extensions;
using SQLContext.Extensions;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;

namespace SQLContext.Services.Implementations
{
    public class WhereClauseService : IWhereClauseService
    {
        public WhereClauseModel Where<T>(Expression<Func<T, bool>> param) where T : class =>
            MapWhere(param.Body as BinaryExpression);

        private WhereClauseModel MapMethod(MethodCallExpression exp)
        {
            switch (exp.Method.Name)
            {
                case "Contains":
                    var arg = exp.Arguments.FirstOrDefault() as MemberExpression;
                    var val = (((exp.Object as MemberExpression).Expression as MemberExpression).Expression as ConstantExpression).Value;
                    var obj = val.GetType().GetFields().FirstOrDefault().GetValue(val);
                    var value = obj.GetType().GetProperty((exp.Object as MemberExpression).Member.Name).GetValue(obj) as IList;
                    if (value == null || value.Count == 0)
                        return null;
                    return new WhereClauseModel(
                        string.Format("{0}.{1}", GetTableName(arg.Member.DeclaringType), arg.Member.Name.QuoteName()),
                        " IN ",
                        $"({string.Join(',', value.Cast<object>().ToList())})"
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
        private WhereClauseModel MapWhere(Expression expParam, string expressionBind = null)
        {
            if (expParam.NodeType == ExpressionType.Call)
                return MapMethod((MethodCallExpression)expParam);
            var exp = (BinaryExpression)expParam;

            if (exp == null)
                return null;
            expressionBind = exp.NodeType.ParentExpressionTypeToSql();
            var whereClause = new WhereClauseModel(expressionBind);
            if (expressionBind != null)
            {
                whereClause.Left = MapWhere(exp.Left, expressionBind);
                whereClause.Right = MapWhere(exp.Right, expressionBind);
                return whereClause;
            }

            var leftMemberExp = (exp.Left as MemberExpression);

            var parentTable = GetTableName(leftMemberExp.Member.DeclaringType);

            string rightMember = null;
            switch (exp.Right.NodeType)
            {
                case ExpressionType.Constant:
                    rightMember = (exp.Right as ConstantExpression).Value.ToString();
                    break;
                case ExpressionType.MemberAccess:
                    var val = exp.Right.Invoke();
                    rightMember = val != null ? val.ToString() : null;
                    break;
                case ExpressionType.Convert:
                    rightMember = (exp.Right as UnaryExpression).Operand.Invoke().ToString();
                    break;
                default:
                    break;
            }
            return new WhereClauseModel(
                string.Format("{0}.{1}", parentTable.QuoteName(), leftMemberExp.Member.Name.QuoteName()),
                exp.NodeType.ExpressionTypeToSql(rightMember == null),
                rightMember.AddQuotes(),
                expressionBind
            );
        }
    }
}
