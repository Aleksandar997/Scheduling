using Common.Extensions;
using SQLContext.Attributes;
using SQLContext.Extensions;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace SQLContext.Services.Implementations
{
    public class WhereClauseService : IWhereClauseService
    {
        public WhereClauseModel Where<T>(Expression<Func<T, bool>> param) where T : class =>
            MapWhere(param.Body as BinaryExpression);

        public WhereClauseModel Where<T, T2>(Expression<Func<T, T2, bool>> param) where T : class =>
            MapWhere(param.Body as BinaryExpression);

        private WhereClauseModel MapMethod(MethodCallExpression exp)
        {
            switch (exp.Method.Name)
            {
                case "Contains":
                    var arg = exp.Arguments.FirstOrDefault() as MemberExpression;
                    var member = (exp.Object as MemberExpression);
                    var val = arg.Invoke();
                    if (val == null)
                        return null;
                    return new WhereClauseModel(
                            string.Format("{0}.{1}", member.Expression.Type.GetTableName(), member.Member.Name),
                            " like ",
                            @"'%" + val + @"%'"
                        //$"({string.Join(',', value.Cast<object>().ToList())})"
                    );
                    //var f = (((exp.Object as MemberExpression).Expression as MemberExpression).Expression as ConstantExpression);
                    //var val = (((exp.Object as MemberExpression).Expression as MemberExpression).Expression as ConstantExpression).Value;
                    //var obj = val.GetType().GetFields().FirstOrDefault().GetValue(val);
                    //var value = obj.GetType().GetProperty((exp.Object as MemberExpression).Member.Name).GetValue(obj) as IList;
                    //if (value == null || value.Count == 0)
                    //    return null;
                    //return new WhereClauseModel(
                    //    string.Format("{0}.{1}", GetTableName(arg.Member.DeclaringType), arg.Member.Name.QuoteName()),
                    //    " IN ",
                    //    $"({string.Join(',', value.Cast<object>().ToList())})"
                    //);
                default:
                    return null;
            }
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
            var parentTable = leftMemberExp.Member.DeclaringType.GetTableName();

            string rightMember = MapExpression(exp.Right);

            return new WhereClauseModel(
                string.Format("{0}.{1}", parentTable.QuoteName(), leftMemberExp.Member.Name.QuoteName()),
                exp.NodeType.ExpressionTypeToSql(rightMember == null),
                rightMember.AddQuotes(),
                expressionBind
            );
        }
        private string MapExpression(Expression exp)
        {
            switch (exp.NodeType)
            {
                case ExpressionType.Constant:
                    var constVal = (exp as ConstantExpression).Value;
                    return constVal != null ? constVal.ToString() : null;
                case ExpressionType.MemberAccess:
                    var val = exp.Invoke();
                    return val != null ? val.ToString() : null;
                case ExpressionType.Convert:
                    return (exp as UnaryExpression).Operand.Invoke().ToString();
                default:
                    return null;
            }
        }
    }
}
