using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace Common.Service
{
    public static class ReflectionService 
        //: IReflectionService
    {
        //public async Task<IEnumerable<object>> InvokeAsync<Target>(Target target, string methodName, object[] parameters, Type[] genericType = null) =>
        //    await InvokeAsync<Target, object>(target, methodName, parameters, genericType);
  
        public static async Task<Output> InvokeAsync<Target, Output>(Target target, string methodName, object[] parameters, Type[] genericType = null)
        {
            return await ExecuteAsync(async () =>
            {
                var method = typeof(Target).GetMethod(methodName, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                if (genericType != null)
                {
                    var a = typeof(Output);
                    var genericMethod = method.MakeGenericMethod(genericType);
                    var gg = genericMethod.Invoke(target, parameters).GetType();
                    return await (genericMethod.Invoke(target, parameters) as Task<Output>);
                }
                return await (method.Invoke(target, parameters) as Task<Output>);
            });
        }

        //public dynamic Invoke<Target>(Target target, string methodName, object[] parameters, Type[] genericType = null) =>
        //    Invoke<Target, dynamic>(target, methodName, parameters, genericType);

        public static Output Invoke<Target, Output>(Target target, string methodName, object[] parameters, Type[] genericType = null)
        {
            return Execute(() =>
            {
                var method = typeof(Target).GetMethod(methodName, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                if (genericType != null)
                {
                    var genericMethod = method.MakeGenericMethod(genericType);
                    return (Output)genericMethod.Invoke(target, parameters);
                }
                return (Output)method.Invoke(target, parameters);
            });
        }

        private static T Execute<T>(Func<T> func)
        {
            try
            {
                return func.Invoke();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static async Task<T> ExecuteAsync<T>(Func<Task<T>> func)
        {
            try
            {
                return await func.Invoke();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
