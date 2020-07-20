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

        public ExecuteInfoModel(JoinModel[] contexts, Type baseTable)
        {
            Contexts = contexts;
            SplitOn = string.Join(",", contexts.Select(x => x.ChildColumn));
            Types = contexts.Select(x => x.Type).ToList();
            Types.Insert(0, baseTable);
        }
    }
}
