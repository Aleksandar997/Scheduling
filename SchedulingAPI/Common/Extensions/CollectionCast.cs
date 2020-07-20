using System;
using System.Collections.Generic;
using System.Linq;

namespace Common.Extensions
{
    public static class CollectionCast
    {
        public static object CastToType(this List<object> items, Type type)
        {
            var enumerableType = typeof(Enumerable);
            var castMethod = enumerableType.GetMethod(nameof(Enumerable.Cast)).MakeGenericMethod(type);
            var toListMethod = enumerableType.GetMethod(nameof(Enumerable.ToList)).MakeGenericMethod(type);

            IEnumerable<object> itemsToCast = items.Select(item => Convert.ChangeType(item, type));

            var castedItems = castMethod.Invoke(null, new[] { itemsToCast });

            var a=  toListMethod.Invoke(null, new[] { castedItems });
            return a;
        }
        public static object CastToType(this IEnumerable<object> items, Type type) => CastToType(items.ToList(), type);
    }
}
