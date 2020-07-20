using Localization.Interfaces;
using Localization.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Localization.Service
{
    public class LocalizationService : ILocalizationService
    {
        private ILocalizationRepository _repository;
        private static List<Culture> _localization;
        public static int _cultureId = 1;
        //private int CultureId
        //{
        //    get => cultureId == 0 ? SelectInUseCulture() : cultureId;
        //    set => cultureId = value;
        //}

        public LocalizationService(ILocalizationRepository repository)
        {
            _repository = repository;
            _localization = LocalizationSelectAll();
        }

        private List<Culture> LocalizationSelectAll()
        {
            return _repository.SelectAllByCulture().Result.Data.ToList();
        }

        private int SelectInUseCulture()
        {
            return _repository.SelectInUseCulture().Result.Data;
        }

        public static string GetTranslate(string resource)
        {
            var culture = _localization.Where(c => c.CultureId == _cultureId).FirstOrDefault();
            if (culture == null || resource == null)
                return resource;

            if (resource.Contains(";"))
            {
                var resourceAndObject = resource.Split(";");

                var translate = culture.LocalizationPair.ContainsKey(resourceAndObject.ElementAtOrDefault(0))
                    ? culture.LocalizationPair[resourceAndObject.ElementAtOrDefault(0)] : resource;
                return string.Format(translate, resourceAndObject.ElementAtOrDefault(1));
            }
            return culture.LocalizationPair.ContainsKey(resource) ? culture.LocalizationPair[resource] : resource;
        }

        public void SetCulture(int cultureId)
        {
            _cultureId = cultureId;
        }
        public void RefreshData()
        {
            _localization.Clear();
            _localization = LocalizationSelectAll();
        }

        public IEnumerable<Culture> GetAllLocalizationByCulture()
        {
            return _localization;
        }
    }
}
