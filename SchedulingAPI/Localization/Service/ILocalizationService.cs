using Entity.Base;
using Localization.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Localization.Service
{
    public interface ILocalizationService
    {
        void RefreshData();
        IEnumerable<Culture> GetAllLocalizationByCulture();
        //string GetTranslate(string resource);
        Task<ResponseBase<IEnumerable<Resource>>> SelectAll(ResourcePaging paging);
        Task<ResponseBase<Resource>> SelectById(int resourceId);
        Task<ResponseBase<Resource>> Save(Resource resource, int userId);
        Task<ResponseBase<IEnumerable<Culture>>> CultureSelectlist();
    }
}
