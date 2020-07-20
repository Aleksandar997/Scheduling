using SQLContext.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace SQLContext.Models
{
    public enum JoinType { Inner, Left, Right, Full };
    public abstract class JoinModel
    {
        public string ParentTable { get; set; }
        public string ChildTable { get; set; }
        public string ParentColumn { get; set; }
        public string ChildColumn { get; set; }
        public Type Type { get; set; }

        public JoinModel(string parentTable, string childTable, string parentColumn, string childColumn, Type type)
        {
            ParentTable = parentTable;
            ChildTable = childTable;
            ParentColumn = parentColumn;
            ChildColumn = childColumn;
            Type = type;
        }
        public virtual string ToSql() => $"INNER JOIN {ChildTable.QuoteName()} ON {ChildTable.QuoteName()}.{ChildColumn.QuoteName()} = {ParentTable.QuoteName()}.{ParentColumn.QuoteName()}";
    }

    public class InnerJoinModel : JoinModel 
    {
        public InnerJoinModel(string parentTable, string childTable, string parentColumn, string childColumn, Type type) : base(parentTable, childTable, parentColumn, childColumn, type)
        {
        }
    }
    public class LeftJoinModel : JoinModel
    {
        public LeftJoinModel(string parentTable, string childTable, string parentColumn, string childColumn, Type type) : base(parentTable, childTable, parentColumn, childColumn, type)
        {
        }
        public override string ToSql() => $"LEFT JOIN {ChildTable.QuoteName()} ON {ChildTable.QuoteName()}.{ChildColumn.QuoteName()} = {ParentTable.QuoteName()}.{ParentColumn.QuoteName()}";
    }
    public class RightJoinModel : JoinModel
    {
        public RightJoinModel(string parentTable, string childTable, string parentColumn, string childColumn, Type type) : base(parentTable, childTable, parentColumn, childColumn, type)
        {
        }
        public override string ToSql() => $"RIGHT JOIN {ChildTable.QuoteName()} ON {ChildTable.QuoteName()}.{ChildColumn.QuoteName()} = {ParentTable.QuoteName()}.{ParentColumn.QuoteName()}";
    }
    public class FullJoinModel : JoinModel
    {
        public FullJoinModel(string parentTable, string childTable, string parentColumn, string childColumn, Type type) : base(parentTable, childTable, parentColumn, childColumn, type)
        {
        }
        public override string ToSql() => $"FULL JOIN {ChildTable.QuoteName()} ON {ChildTable.QuoteName()}.{ChildColumn.QuoteName()} = {ParentTable.QuoteName()}.{ParentColumn.QuoteName()}";
    }
}
