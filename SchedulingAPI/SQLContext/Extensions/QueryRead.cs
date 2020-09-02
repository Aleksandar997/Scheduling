using Dapper;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace SQLContext.Extensions
{
    internal static class QueryRead
    {
        public static List<object> Read(this SqlMapper.GridReader reader, ExecuteInfoModel execModel)
        {
            var ff = execModel.Types.ToArray();
            return reader.Read(execModel.Types.ToArray(), ((resRaw) =>
            {
                var res = resRaw.FirstOrDefault();
                for (int i = 0; i < execModel.Contexts.Count(); i++)
                {
                    var prop = execModel.Contexts[i];
                    GetNested(res.GetType(), prop, res, resRaw[i + 1]);

                }
                return res;
            }), execModel.SplitOn).ToList();
        }
        private static void GetNested(Type type, JoinModel context, object obj, object value)
        {
            if (type.GetTableName() == context.ParentTable)
            {
                type.GetProperty(context.ChildTable).SetValue(obj, value);
                return;
            }
            var prop = type.GetProperty(context.ParentTable).PropertyType;
            //var a = type.GetProperty(context.ParentTable).PropertyType;
            //var b = type.GetProperty(context.ChildTable).GetValue(obj);
            GetNested(
                prop, 
                context,
                obj.GetType().GetProperty(context.ParentTable).GetValue(obj), 
                value);
        }
    }
}
