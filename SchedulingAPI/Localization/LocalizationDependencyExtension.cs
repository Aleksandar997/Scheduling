using Common.Base;
using Entity;
using Localization.Implementation;
using Localization.Interfaces;
using Localization.Service;
using Microsoft.Extensions.DependencyInjection;

namespace Localization
{
    public static class LocalizationDependencyExtension
    {
        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddLocalizationDependencies(this IServiceCollection services)
        {
            services.AddSingleton<ILocalizationRepository, LocalizationRepository>(x => new LocalizationRepository(connectionString));
            services.AddSingleton<ILocalizationService, LocalizationService>(x => new LocalizationService(DependencyInjectionResolver.GetService<ILocalizationRepository>()));
        }
    }
}
