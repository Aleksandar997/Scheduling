using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Common.Extensions
{
    public static class ExpressionInvoke
    {
        public static object Invoke(this Expression exp)
        {
            var objectMember = Expression.Convert(exp, typeof(object));
            var getterLambda = Expression.Lambda<Func<object>>(objectMember);
            var getter = getterLambda.Compile();
            return getter();
        }
    }
}
