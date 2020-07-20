using Configuration.Models;
using Configuration.Repository;
using Configuration.Services;
using Entity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Configuration.Extensions
{
    public static class ConfigurationExtensions
    {
        public static IConfigurationBuilder AddDatabaseConfig(this IConfigurationBuilder builder, IConfigurationService configurationService)
        {
            return builder.Add(new ConfigurationSource(configurationService));
        }
        public static void LoadDatabaseConfiguration(this IConfiguration configuration, IConfigurationService configurationService)
        {
            var configBuilder = new ConfigurationBuilder()
                .AddDatabaseConfig(configurationService);
            configBuilder.Build().Bind(AppSettings.Instance);
        }
    }
}
