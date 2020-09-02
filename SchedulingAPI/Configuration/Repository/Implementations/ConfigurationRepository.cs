using Configuration.Models;
using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Configuration.Repository
{
    public class ConfigurationRepository : RepositoryBase, IConfigurationRepository
    {
        public ConfigurationRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<ResponseBase<IEnumerable<ConfigurationModel>>> GetConfiguration() =>
                await SqlContextFactory.Instance<ConfigurationModel>(ConnectionString, "GetConfiguration")
                    .Select(x => new
                    {
                        x.ConfigurationId,
                        x.Name,
                        x.Value,
                        x.ParentId
                    })
                    .Execute();
    }
}
