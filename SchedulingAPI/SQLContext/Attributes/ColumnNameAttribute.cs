using System;

namespace SQLContext.Attributes
{
    public class ColumnNameAttribute : Attribute
    {
        public string Name { get; set; }
        public bool GetPrimaryKeyName { get; set; }
        public ColumnNameAttribute(string name)
        {
            Name = name;
        }
        public ColumnNameAttribute(bool getPrimaryKeyName)
        {
            GetPrimaryKeyName = getPrimaryKeyName;
        }
    }
}
