using Common.Base;
using Entity;
using Microsoft.Extensions.DependencyInjection;
using UserManagement.Repository.Implementations;
using UserManagement.Repository.Interfaces;
using UserManagement.Service.Implementations;
using UserManagement.Service.Interfaces;

namespace UserManagement
{
    public static class UserManagementDependencyExtension
    {
        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddUserManagementDependencies(this IServiceCollection services) 
        {
            services.AddSingleton<IUserRepository, UserRepository>(x => new UserRepository(connectionString));
            services.AddSingleton<IRoleRepository, RoleRepository>(x => new RoleRepository(connectionString));
            services.AddSingleton<IUserService, UserService>(x => new UserService(DependencyInjectionResolver.GetService<IUserRepository>()));
            services.AddSingleton<IRegisterRepository, RegisterRepository>(x => new RegisterRepository(connectionString));
            services.AddSingleton<IRegisterService, RegisterService>(x => new RegisterService(DependencyInjectionResolver.GetService<IRegisterRepository>()));
        }
    }
}
