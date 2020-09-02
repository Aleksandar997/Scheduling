using SQLContext.Extensions;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace SQLContext.Services.Implementations
{
    public class SaveService : ISaveService
    {
        public SaveModel Save<T, TResult>(Expression<Func<T, TResult>> param, T input, int? id) where T : class
        {
            var grouped = (param.Body as NewExpression).Arguments.GroupBy(x => (x as MemberExpression).Expression.Type).FirstOrDefault();
            return new SaveModel(
                grouped.Key.Name, 
                grouped.Select(x => (x as MemberExpression).Member.Name).ToList(), 
                //grouped.Select(x => input.GetType().GetProperty((x as MemberExpression).Member.Name).GetValue(input).ToString()).Cast<string>().ToList(),
                grouped.Select(x => GetValue(x as MemberExpression, input)).ToList(),
                id,
                grouped.Key
           );
        }
        private string GetValue<T>(MemberExpression prop, T input)
        {
            var key = input.GetType().Name;
            if (prop.Member.DeclaringType.Name != key)
                return GetValue(prop, input.GetType().GetProperty(prop.Member.DeclaringType.Name).GetValue(input));
            return input.GetType().GetProperty(prop.Member.Name).GetValue(input).ToString();
        }
    }
}
