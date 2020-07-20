using Localization.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Localization.Service
{
    public interface ILocalizationService
    {
        void RefreshData();
        IEnumerable<Culture> GetAllLocalizationByCulture();
        //string GetTranslate(string resource);
        void SetCulture(int cultureId);
    }
}
