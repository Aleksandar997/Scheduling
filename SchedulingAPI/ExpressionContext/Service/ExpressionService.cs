using Common.Extensions;
using ExpressionContext.Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace ExpressionContext.Service
{
    internal class ExpressionService : IExpressionService
    {
        public NewExpressionOutputModel NewExpression(NewExpressionModel newExpressionModel)
        {
            var input = Expression.Parameter(newExpressionModel.BaseType, newExpressionModel.BaseType.Name);
            var props = newExpressionModel.Select(x => GetExpressionProp(x.Name, x.Type)).ToList();
            var args = props.Select(x => x.Type).ToArray();
            var constructor = newExpressionModel.BaseType.GetConstructor(args);
            if (constructor == null)
                throw new Exception(string.Format(
                    "CLASS {0} DOESN'T HAVE CONSTRUCTOR MATCHING THE TYPES: {1}",
                    newExpressionModel.BaseType.Name, string.Join(", ", args.Select(x => x.Name)))
                    );
            return new NewExpressionOutputModel(Expression.New(constructor, props), input);
        }

        public MemberExpression GetExpressionProp(string prop, Type type, MemberExpression nested = null)
        {
            if (prop.Contains("."))
            {
                var propSplit = prop.Split(".");
                var first = type.GetProperty(propSplit.ElementAtOrDefault(0).FirstCharToUpper());
                nested = nested == null ? Expression.Property(Expression.Parameter(type), first.Name) : Expression.Property(nested, first);

                return GetExpressionProp(string.Join(".", propSplit.Skip(1)), first.PropertyType, nested);
                //return GetExpressionProp(string.Join(".", propSplit.Skip(1)), type.GetProperty(first).PropertyType, asdf);
            }
            var propInfo = type.GetProperty(prop.FirstCharToUpper());
            if (propInfo == null)
                throw new Exception(string.Format(
                    "CLASS {0} DOESN'T HAVE PROPERTY {1}",
                    type.Name, prop)
                    );
            return nested == null ? Expression.Property(Expression.Parameter(type), type.GetProperty(prop.FirstCharToUpper())) : Expression.Property(nested, prop);
        }
    }
}
