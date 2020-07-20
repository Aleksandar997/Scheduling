using Entity.Base;
using Localization.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Localization.Interfaces
{
    public interface ILocalizationRepository
    {
        Task<ResponseBase<IEnumerable<Culture>>> SelectAllByCulture();
        Task<ResponseBase<int>> SelectInUseCulture();
    }
}
