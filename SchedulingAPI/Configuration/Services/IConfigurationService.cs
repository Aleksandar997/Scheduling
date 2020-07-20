using Configuration.Models;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.Services
{
    public interface IConfigurationService
    {
        Task<ResponseBase<IEnumerable<ConfigurationModel>>> GetConfiguration();
    }
}
