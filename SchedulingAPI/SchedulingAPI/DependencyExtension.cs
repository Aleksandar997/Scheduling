using Common.Base;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using SchedulingAPI.Repository.Implementations;
using SchedulingAPI.Repository.Interfaces;
using SchedulingAPI.Services.Implementations;
using SchedulingAPI.Services.Interfaces;
using sysIUserService = UserManagement.Service.Interfaces.IUserService;

namespace SchedulingAPI
{
    public static class DependencyExtension
    {
        private static string ConnectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddDependencies(this IServiceCollection services)
        {
            services.AddTransient<IMemoryCache, MemoryCache>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IScheduleRepository, ScheduleRepository>(x => new ScheduleRepository(ConnectionString));
            services.AddSingleton<ISystemRepository, SystemRepository>(x => new SystemRepository(ConnectionString));
            services.AddSingleton<IDocumentRepository, DocumentRepository>(x => new DocumentRepository(ConnectionString));
            services.AddSingleton<IProductRepository, ProductRepository>(x => new ProductRepository(ConnectionString));
            services.AddSingleton<ICustomerRepository, CustomerRepository>(x => new CustomerRepository(ConnectionString));
            services.AddSingleton<IUserRepository, UserRepository>(x => new UserRepository(ConnectionString));
            services.AddSingleton<IUserService, UserService>(x => new UserService(
                DependencyInjectionResolver.GetService<IUserRepository>(),
                DependencyInjectionResolver.GetService<sysIUserService>()
            ));
            services.AddSingleton<IOrganizationUnitRepository, OrganizationUnitRepository>(x => new OrganizationUnitRepository(ConnectionString));
            services.AddSingleton<IChartRepository, ChartRepository>(x => new ChartRepository(ConnectionString));
        }
    }
}
