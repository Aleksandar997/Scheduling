using System;
using System.Collections.Generic;
using System.Text;

namespace System.ComponentModel.DataAnnotations.Schema
{
    public class TableNameAttribute : Attribute
    {
        public bool GetTableNameFromImplementation { get; set; }
        public string Name { get; set; }
        public TableNameAttribute(string name) 
        {
            Name = name;
        }

        public TableNameAttribute(bool getTableNameFromImplementation)
        {
            GetTableNameFromImplementation = getTableNameFromImplementation;
        }

    }
}
