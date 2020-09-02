using Common.Extensions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;

namespace ExpressionContext.Models
{
    public class NewExpressionModel : List<NewExpressionColumnModel> 
    {
        //public List<string> Columns { get; set; }
        //public Type Type { get; set; }

        //public static NewExpressionModel Instance(List<string> columns, Type type) => new NewExpressionModel(columns, type);
        //public static NewExpressionModel Instance(string column, Type type) => new NewExpressionModel(new List<string>() { column }, type);
        //private NewExpressionModel(List<string> columns, Type type)
        //{
        //    Columns = columns;
        //    Type = type;
        //}
        public Type BaseType { get; set; }
        public static NewExpressionModel Instance(IEnumerable<NewExpressionColumnModel> cols, Type baseType) => new NewExpressionModel(cols, baseType);
        private NewExpressionModel(IEnumerable<NewExpressionColumnModel> cols, Type baseType)
        {
            AddRange(cols);
            BaseType = baseType;
        }
    }

    public class NewExpressionColumnModel
    {
        public string Name { get; set; }
        public Type Type { get; set; }

        public static NewExpressionColumnModel Instance(string name, Type type) => new NewExpressionColumnModel(name, type);
        private NewExpressionColumnModel(string name, Type type)
        {
            Name = name;
            Type = type;
        }
    }


    public enum BinaryType { And, Or, Default }

    public class BinaryModel
    {
        private string value { get; set; }
        public string Value
        {
            get => value;
            set => this.value = value.SpliceLambda();
        }
        public ExpressionType BinaryType { get; set; }
        public BinaryModel Next { get; set; }
        //public BinaryModel Right { get; set; }
        //public BinaryModel Left { get; set; }
    }

    public class NewExpressionOutputModel
    {
        public Expression Expression { get; set; }
        public ParameterExpression Input { get; set; }

        public NewExpressionOutputModel(Expression expression, ParameterExpression input)
        {
            Expression = expression;
            Input = input;
        }
    }
}
