using System;

namespace Common.Base
{
    public static class DependencyInjectionResolver
    {
        public static void Initialization(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider;
        }

        public static IServiceProvider ServiceProvider { get; set; }

        public static T GetService<T>() => (T)ServiceProvider.GetService(typeof(T));
    }
}
