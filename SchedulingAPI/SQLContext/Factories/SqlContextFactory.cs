using Common.Base;
using Microsoft.Extensions.Caching.Memory;
using SQLContext.Builders;
using SQLContext.Models;
using System;
using System.Linq.Expressions;

namespace SQLContext.Factories
{
    public class SqlContextFactory
    {
        public static SqlBuilder<T> Instance<T>(string connectionString, string key, bool autoJoin = false) where T : class =>
            new SqlBuilder<T>(SqlContextCache.TryGetValue(key), connectionString, key, autoJoin);

        public static SqlBuilder<TChild> Instance<TParent, TChild>(
                Expression<Func<TParent, object>> parent,
                Expression<Func<TChild, object>> child,
                string connectionString
                //bool autoJoin = false
            ) where TParent : class where TChild : class =>
                new SqlBuilder<TChild>(connectionString, false).JoinSubQuery(parent, child);

        public static SqlBuilder<T> Instance<T>(string connectionString, bool autoJoin = false) where T : class =>
            new SqlBuilder<T>(connectionString, autoJoin);


        public static ManualSqlBuilder InstanceManual(string connectionString) => new ManualSqlBuilder(connectionString);
    }

    internal static class SqlContextCache
    {
        private static readonly IMemoryCache Cache = DependencyInjectionResolver.GetService<IMemoryCache>();

        public static SelectModel TryGetValue(string key)
        {
            SelectModel cache = null;
            if (key != null)
                Cache.TryGetValue(key, out cache);
            return cache;
        }

        internal static void TrySetValue(string key, SelectModel selectModel)
        {
            if (key != null)
                Cache.Set(key, selectModel);
        }
    }
}
