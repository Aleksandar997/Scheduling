using CodebookManagement.Attributes;
using ExpressionContext.Models;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace CodebookManagement.Models
{
    public interface ICodebook
    {
        public int? Id { get; }
    }
    public class CodebookOutputModel<T>
    {
        public IEnumerable<CodebookColumn> Columns { get; set; }
        public T Data { get; set; }
        public CodebookOutputModel(IEnumerable<CodebookColumn> columns, T data)
        {
            Columns = columns.ToList().Select(x =>
            {
                x.Type = null;
                return x;
            }).AsEnumerable();
            Data = data;
        }
        public CodebookOutputModel<T> ProcessData(T data)
        {
            Data = data;
            return this;
        }
    }
    public class CodebookColumn
    {
        public string Name { get; set; }
        public ControlType ControlType { get; set; }
        public bool Display { get; set; }
        public bool Editable { get; set; }
        public Type Type { get; set; }
        public CodebookColumn(string name, ControlType controlType, bool display, bool editable, Type type)
        {
            Name = name;
            ControlType = controlType;
            Display = display;
            Type = type;
            Editable = editable;
        }
        public CodebookColumn() { }
    }
    //public class Join
    //{
    //    public JoinType JoinType { get; set; }
    //    public LambdaExpression BaseTable { get; set; }
    //    public LambdaExpression JoinTable { get; set; }

    //    public Join(JoinType joinType, LambdaExpression baseTable, LambdaExpression joinTable)
    //    {
    //        JoinType = joinType;
    //        BaseTable = baseTable;
    //        JoinTable = joinTable;
    //    }
    //}
}

