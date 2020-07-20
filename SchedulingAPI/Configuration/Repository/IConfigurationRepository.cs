using Configuration.Models;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.Repository
{
    public interface IConfigurationRepository
    {
        Task<ResponseBase<IEnumerable<ConfigurationModel>>> GetConfiguration();
    }
}
