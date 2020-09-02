using SQLContext.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SQLContext.Models
{
    internal class ExecuteInfoModel
    {
        public JoinModel[] Contexts { get; private set; }
        public string SplitOn { get; private set; }
        public List<Type> Types { get; private set; }

        public ExecuteInfoModel(List<JoinModel> contexts, Columns columns, Type baseTable)
        {
            Contexts = contexts.Where(x => columns.Select(c => c.TableType).Contains(x.Type)).ToArray();
            //SplitOn = string.Join(",", contexts.Select(x => x.ChildColumn));
            SplitOn = string.Join(",", contexts.Select(x => columns.FirstOrDefault(c => c.Table == x.Type.Name).CleanValue));
            //SplitOn = string.Join(",", contexts.Select(x => x.ChildColumn));
            Types = contexts.Select(x => x.Type).ToList();
            Types.Insert(0, baseTable);
        }
    }
}
