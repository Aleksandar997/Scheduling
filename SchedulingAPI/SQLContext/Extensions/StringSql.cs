using System;
using System.Collections.Generic;
using System.Text;

namespace SQLContext.Extensions
{
    public static class StringSql 
    {
        public static string QuoteName(this string stringArg) => "[" + stringArg + "]";
        //public static string QuoteName(this string stringArg) => "`" + stringArg + "`";
        public static string AddQuotes(this string stringArg) => "'" + stringArg + "'";
        public static string AddBrackets(this string stringArg) => "(" + stringArg + ")";

        public static string UnQuoteName(this string stringArg) => stringArg.Substring(1, stringArg.Length - 2);
    }
    public interface Teest
    {

    }
}
