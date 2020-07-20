using Configuration.Models;
using Configuration.Repository;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.Services
{
    public class ConfigurationService : IConfigurationService
    {
        IConfigurationRepository _configurationRepository;
        public ConfigurationService(IConfigurationRepository configurationRepository)
        {
            _configurationRepository = configurationRepository;
        }

        public async Task<ResponseBase<IEnumerable<ConfigurationModel>>> GetConfiguration()
        {
            var res = await _configurationRepository.GetConfiguration();
            var parents = res.Data.Where(x => x.ParentId != null && x.ParentId != 0).ToList();
            res.Data = ToTreeView(res.Data, parents);
            return res;
        }
        private IEnumerable<ConfigurationModel> ToTreeView
            (
                IEnumerable<ConfigurationModel> data, 
                List<ConfigurationModel> parents, 
                List<ConfigurationModel> result = null
            )
        {
            result ??= new List<ConfigurationModel>();

            foreach (var parent in parents)
            {
                foreach (var child in data)
                {
                    if (parent.ConfigurationId == child.ParentId)
                    {
                        if (child.Value == null)
                            child.Name = parent.Name + ":" + child.Name;
                        else
                        {
                            var config = new ConfigurationModel()
                            {
                                Path = parent.Name + ":" + child.Name,
                                Value = child.Value
                            };
                            result.Add(config);
                        }
                        ToTreeView(data, new List<ConfigurationModel>() { child });
                    }
                }
            }
            return result;
        }
    }
}
