using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common.Extensions
{
    public static class QueryUrl
    {
        public static T ToObject<T>(this IQueryCollection keyValuePairs)
        {
            var json = keyValuePairs.FirstOrDefault().Value;
            return JsonConvert.DeserializeObject<T>(json);
        }
        public static List<T> ToList<T>(this IQueryCollection keyValuePairs)
        {
            var json = keyValuePairs.FirstOrDefault().Value;
            return JsonConvert.DeserializeObject<List<T>>(json);
        }
    }
}
