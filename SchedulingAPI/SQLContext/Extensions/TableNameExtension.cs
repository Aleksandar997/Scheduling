using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;

namespace SQLContext.Extensions
{
    public static class TableNameExtension
    {
        public static string GetTableName(this Type type)
        {
            var attribute = type.GetCustomAttribute(typeof(TableAttribute)) as TableAttribute;
            return attribute != null ? attribute.Name : type.Name;
        }
    }
}
