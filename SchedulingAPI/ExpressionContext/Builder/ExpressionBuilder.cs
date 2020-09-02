using Common.Base;
using ExpressionContext.Options;
using ExpressionContext.Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using ExpressionContext.Service;
using Common.Extensions;

namespace ExpressionContext.Builder
{
    public class ExpressionBuilder
    {
        Expression _expression;
        ParameterExpression _input;
        Type _type { get; set; }
        private IOptions options = DependencyInjectionResolver.GetService<IOptions>();
        private IExpressionService _expressionService = DependencyInjectionResolver.GetService<IExpressionService>();
        public ExpressionBuilder() { }
        public ExpressionBuilder NewExpression(NewExpressionModel newExpressionModel)
        {
            return Execute(() =>
            {
                //_type = newExpressionModel.Type;
                var res = _expressionService.NewExpression(newExpressionModel);
                _expression = res.Expression;
                _input = res.Input;
                return this;
            });
        }

        public LambdaExpression LambdaExpression()
        {
            return Execute(() => Expression.Lambda(_expression, _input));
        }

        public Expression<Func<input, output>> LambdaExpression<input, output>()
        {
            return Execute(() => Expression.Lambda<Func<input, output>>(_expression, _input));
        }

        public Expression<Func<input>> LambdaExpression<input>()
        {
            return Execute(() => Expression.Lambda<Func<input>>(_expression, _input));
        }

        public T Execute<T>(Func<T> func)
        {
            try
            {
                return func.Invoke();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
