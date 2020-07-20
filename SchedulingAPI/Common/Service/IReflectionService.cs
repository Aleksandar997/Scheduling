using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Common.Service
{
    public interface IReflectionService
    {
        //Task<IEnumerable<dynamic>> InvokeAsync<Target>(Target target, string methodName, object[] parameters, Type[] genericType = null);
        Task<Output> InvokeAsync<Target, Output>(Target target, string methodName, object[] parameters, Type[] genericType = null);
        //dynamic Invoke<Target>(Target target, string methodName, object[] parameters, Type[] genericType = null);
        Output Invoke<Target, Output>(Target target, string methodName, object[] parameters, Type[] genericType = null);
    }
}
