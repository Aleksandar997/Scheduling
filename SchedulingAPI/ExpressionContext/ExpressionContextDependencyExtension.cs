using ExpressionContext.Options;
using ExpressionContext.Service;
using Microsoft.Extensions.DependencyInjection;

namespace ExpressionContext
{
    public static class ExpressionContextDependencyExtension
    {
        public static void AddExpressionContextDependencies(this IServiceCollection services)
        {
            services.AddSingleton<IOptions, AngularOptions>();
            services.AddSingleton<IExpressionService, ExpressionService>();
        }
    }
}
