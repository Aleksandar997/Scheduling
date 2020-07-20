using Configuration.Repository;
using Configuration.Services;
using Entity;
using Microsoft.Extensions.DependencyInjection;

namespace Configuration.Extensions
{
    public static class ConfigurationDependencyExtension
    {
        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddConfigurationDependencies(this IServiceCollection services)
        {
            services.AddSingleton<IConfigurationRepository, ConfigurationRepository>(c => new ConfigurationRepository(connectionString));
            services.AddSingleton<IConfigurationService, ConfigurationService>();
        }
    }
}
