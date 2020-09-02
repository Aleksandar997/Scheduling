using ExpressionContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace ExpressionContext.Service
{
    internal interface IExpressionService
    {
        NewExpressionOutputModel NewExpression(NewExpressionModel newExpressionModel);
        MemberExpression GetExpressionProp(string prop, Type type, MemberExpression test = null);
    }
}
