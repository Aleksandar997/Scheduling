using System;

namespace Common.Extensions
{
    public static class NullCheck
    {
        public static T IfNull<T>(this T obj)
        {
            if (obj == null) return (T)Activator.CreateInstance(typeof(T));
            return obj;
        }
    }
}
