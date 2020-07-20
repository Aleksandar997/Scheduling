using SQLContext.Extensions;
using SQLContext.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace SQLContext.Models
{
    public class SelectModel
    {
        private StringBuilder stringBuilder = new StringBuilder();
        internal Columns SelectedColumns { get; set; } = new Columns();
        internal TableModel Table { get; set; }
        internal List<JoinModel> Joins = new List<JoinModel>();
        internal Dictionary<string, SelectModel> SubQueries = new Dictionary<string, SelectModel>();
        internal WhereClauseModel WhereClause { get; set; } = new WhereClauseModel();
        internal OrderByClauseModel OrderBy { get; set; } = new OrderByClauseModel();
        public bool AutoJoin { get; set; }
        internal bool IsGenerated { get; set; }

        internal SelectModel Generate()
        {
            IsGenerated = true;
            return this;
        }

        internal void SetSelectClause(SelectModel selectModel)
        {
            SelectedColumns = selectModel.SelectedColumns;
            Table = selectModel.Table;
            Joins = selectModel.Joins;
            SubQueries = selectModel.SubQueries;
        }

        //internal void SetWhereClause(WhereClauseModel whereClauseModel)
        //{
        //    WhereClauseModel = whereClauseModel;
        //}
        internal void SetOrderByClause(OrderByClauseModel orderByClauseModel)
        {
            OrderBy = orderByClauseModel;
        }

        public SelectModel(bool autoJoin)
        {
            AutoJoin = autoJoin;
        }

        internal static SelectModel Instance(bool autoJoin) => new SelectModel(autoJoin);

        internal string ToSql() => stringBuilder
                     .Clear()
                     .AppendLine(string.Format("SELECT {0}", string.Join(", ", SelectedColumns.Select(x => x.Value))))
                     .AppendLine(string.Format("FROM {0}", (Table.Name.QuoteName().ToString())))
                     .AppendLine($"{string.Join(" ", Joins.Select(x => x.ToSql()))} ")
                     .AppendLine(WhereClause.ToString())
                     .AppendLine(OrderBy.Value)
                     .AppendJoin("", SubQueries.Values.Select(x => x.ToSql()))
                     .ToString();


        internal void Join(MemberExpression exp)
        {
            if (exp == null || exp.NodeType == ExpressionType.Parameter || !AutoJoin)
                return;

            var childTableName = exp.Member.Name;
            var childTableType = exp.Type;
            if (!Joins.Any(x => x.ChildTable == childTableName))
            {
                var parentTable = new TableModel(exp.Expression.Type).Name;
                Joins.Insert(0, new InnerJoinModel(parentTable, childTableName, KeyHelper.GetPrimaryKey(childTableType), KeyHelper.GetForeignKey(exp.Member.DeclaringType, childTableType.Name), childTableType));
            }
            Join(exp.Expression as MemberExpression);
        }
    }
    public class WhereClauseModel
    {
        public WhereClauseModel Left { get; set; }
        public WhereClauseModel Right { get; set; }
        public string Column { get; set; }
        public string ExpressionType { get; set; }
        public string ExpressionBind { get; set; }
        public string Value { get; private set; }
        public WhereClauseModel(string column, string expressionType, string value, string expressionBind = null)
        {
            Column = column;
            ExpressionType = expressionType;
            Value = value;
            ExpressionBind = expressionBind;
        }
        public WhereClauseModel() { }
        public override string ToString()
        {
            var clause = Map();
            return clause != null ? $"WHERE {clause}" : null;
        }
        private string Map()
        {
            if (Column != null)
                return $"({Column}{ExpressionType}{Value})";
            if (Left == null && Right == null)
                return null;
            var left = Left != null ? Left.Map() : null;
            var right = Right != null ? Right.Map() : null;
            if (left == null)
                return right;
            else if (right == null)
                return left;
            return $"({left}{ExpressionBind}{right})";
        }
        public WhereClauseModel(string expressionBind) 
        {
            ExpressionBind = expressionBind;
        }
    }
    public class OrderByClauseModel
    {
        
        internal string Value { get; set; }
        internal OrderByClauseModel()
        {
        }
        internal OrderByClauseModel(string value)
        {
            Value = value;
        }
    }

    public class TableModel
    {
        public string Name { get; private set; }
        public Type Type { get; set; }
        public string ForeignKey { get; set; }
        public string ParentPrimaryKey { get; set; }
        public void SetKeys(string parentPrimaryKey, string foreignKey)
        {
            ParentPrimaryKey = parentPrimaryKey;
            ForeignKey = foreignKey;
        }

        public TableModel(Type type)
        {
            Type = type;
            Name = GetTableName();
        }

        private string GetTableName()
        {
            var attribute = Type.CustomAttributes.Where(x => x.AttributeType == typeof(TableAttribute)).FirstOrDefault();
            if (attribute == null)
                return Type.Name;
            return attribute.ConstructorArguments.FirstOrDefault().Value.ToString();
        }
    }

    public class Columns : List<Column>
    {
        public void AddCol(string tableName, string columnName, Type tableType = null)
        {
            var isPrimary = tableType != null ? KeyHelper.GetPrimaryKey(tableType) == columnName : false;
            Add(new Column(tableName, columnName, isPrimary, tableType));
        }
        public void InsertCol(int index, string tableName, string columnName, Type tableType = null)
        {
            var isPrimary = tableType != null ? KeyHelper.GetPrimaryKey(tableType) == columnName : false;
            Insert(index, new Column(tableName, columnName, isPrimary, tableType));
        }
        public void InsertPrimaryCol(int index, string tableName, string columnName)
        {
            Insert(index, new Column(tableName, columnName, true));
        }
    }

    public class Column
    {
        //private string ColumnValue { get; set; }
        internal string Table { get; private set; }
        internal string Value { get; private set; }
        internal Type TableType { get; set; }
        internal bool IsPrimaryKey { get; set; }
        internal Column(string table, string columnValue, bool isPrimaryKey, Type tableType = null)
        {
            //ColumnValue = columnValue;
            TableType = tableType;
            IsPrimaryKey = isPrimaryKey;
            Table = table;
            Value = table == null ? columnValue : string.Format("{0}.{1}", table.QuoteName(), columnValue.QuoteName());
        }
    }
    
}
