using ExpressionContext.Builder;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExpressionContext.Factory
{
    public class ExpressionBuilderFactory
    {
        //public static ExpressionBuilder Instance(string connectionString, ExpressionBuilderModel expressionBuilderModel) =>
        //    new ExpressionBuilder(connectionString, expressionBuilderModel);
        public static ExpressionBuilder Instance() => new ExpressionBuilder();
    }
}
