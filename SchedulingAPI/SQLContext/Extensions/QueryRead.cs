using Dapper;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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
                    var prop = execModel.Contexts[i].ChildTable;
                    res.GetType().GetProperty(prop).SetValue(res, resRaw[i + 1]);
                }
                return res;
            }), execModel.SplitOn).ToList();
        }
    }
}
