using Configuration.Repository;
using Configuration.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Configuration.Providers
{
    public class CustomConfigurationProvider : ConfigurationProvider
    {
        private IConfigurationService _configurationService;

        public CustomConfigurationProvider(IConfigurationService configurationService)
        {
            _configurationService = configurationService;
        }

        public override void Load()
        {
            var configData = _configurationService.GetConfiguration().Result;
            Data = configData.Data?.ToDictionary(c => c.Path, c => c.Value) ?? new Dictionary<string, string>();
        }
    }
}
