using Entity.Base;
using Localization.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Localization.Interfaces
{
    public interface ILocalizationRepository
    {
        Task<ResponseBase<IEnumerable<Culture>>> SelectAllByCulture();
        Task<ResponseBase<IEnumerable<Resource>>> SelectAll(ResourcePaging paging);
        Task<ResponseBase<Resource>> SelectById(int resourceId);
        Task<ResponseBase<Resource>> Save(Resource resource, int userId);
        Task<ResponseBase<IEnumerable<Culture>>> CultureSelectlist();
    }
}
