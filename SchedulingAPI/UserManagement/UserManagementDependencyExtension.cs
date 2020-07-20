using Common.Base;
using Entity;
using Microsoft.Extensions.DependencyInjection;
using UserManagement.Repository;
using UserManagement.Service;

namespace UserManagement
{
    public static class UserManagementDependencyExtension
    {
        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddUserManagementDependencies(this IServiceCollection services) 
        {
            services.AddSingleton<IUserRepository, UserRepository>(x => new UserRepository(connectionString));
            services.AddSingleton<IUserService, UserService>(x => new UserService(DependencyInjectionResolver.GetService<IUserRepository>()));
        }
    }
}
