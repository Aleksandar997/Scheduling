using Common.Base;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using SchedulingAPI.Repository.Implementations;
using SchedulingAPI.Repository.Interfaces;

namespace SchedulingAPI
{
    public static class DependencyExtension
    {
        private static string ConnectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddDependencies(this IServiceCollection services)
        {
            services.AddSingleton<IMemoryCache, MemoryCache>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IScheduleRepository, ScheduleRepository>(x => new ScheduleRepository(ConnectionString));
            services.AddSingleton<ISystemRepository, SystemRepository>(x => new SystemRepository(ConnectionString));
            services.AddSingleton<IDocumentRepository, DocumentRepository>(x => new DocumentRepository(ConnectionString));
            services.AddSingleton<IProductRepository, ProductRepository>(x => new ProductRepository(ConnectionString));
            services.AddSingleton<ICustomerRepository, CustomerRepository>(x => new CustomerRepository(ConnectionString));
        }
    }
}
