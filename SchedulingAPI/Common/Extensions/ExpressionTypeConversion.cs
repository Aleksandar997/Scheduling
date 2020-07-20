using System.Linq.Expressions;

namespace Common.Extensions
{
    public static class ExpressionTypeConversion
    {
        public static ExpressionType StringToExpressionType(this string expressionType)
        {
            switch (expressionType)
            {
                //case "Contains":
                //    return ExpressionType.C
                case "+":
                    return ExpressionType.Add;
                case "/":
                    return ExpressionType.Divide;
                case "==":
                    return ExpressionType.Equal;
                case "===":
                    return ExpressionType.Equal;
                case "^":
                    return ExpressionType.ExclusiveOr;
                case ">":
                    return ExpressionType.GreaterThan;
                case ">=":
                    return ExpressionType.GreaterThanOrEqual;
                case ">==":
                    return ExpressionType.GreaterThanOrEqual;
                case "<":
                    return ExpressionType.LessThan;
                case "<=":
                    return ExpressionType.LessThanOrEqual;
                case "%":
                    return ExpressionType.Modulo;
                case "*":
                    return ExpressionType.Multiply;
                case "<>":
                    return ExpressionType.NotEqual;
                case "-":
                    return ExpressionType.Subtract;
                case "&&":
                    return ExpressionType.And;
                case "||":
                    return ExpressionType.Or;
                default:
                    return ExpressionType.Default;
            }
        }
        public static string ExpressionTypeToSql(this ExpressionType expressionType, bool rightIsNull)
        {
            switch (expressionType)
            {
                case ExpressionType.Add:
                    return " + ";
                case ExpressionType.Divide:
                    return " / ";
                case ExpressionType.Equal:
                    return rightIsNull ? " IS " : " = ";
                case ExpressionType.ExclusiveOr:
                    return " ^ ";
                case ExpressionType.GreaterThan:
                    return " > ";
                case ExpressionType.GreaterThanOrEqual:
                    return " >= ";
                case ExpressionType.LessThan:
                    return " < ";
                case ExpressionType.LessThanOrEqual:
                    return " <= ";
                case ExpressionType.Modulo:
                    return " % ";
                case ExpressionType.Multiply:
                    return " * ";
                case ExpressionType.Negate:
                    return " - ";
                case ExpressionType.Not:
                    return " NOT ";
                case ExpressionType.NotEqual:
                    return " <> ";
                case ExpressionType.Subtract:
                    return " - ";
                default:
                    return null;
            }
        }
        public static string ParentExpressionTypeToSql(this ExpressionType expressionType)
        {
            switch (expressionType)
            {
                case ExpressionType.And:
                    return " & ";
                case ExpressionType.AndAlso:
                    return " AND ";
                case ExpressionType.Or:
                    return " | ";
                case ExpressionType.OrElse:
                    return " OR ";
                default:
                    return null;
            }
        }
    }
}
