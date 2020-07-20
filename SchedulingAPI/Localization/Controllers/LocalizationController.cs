using Localization.Implementation;
using Localization.Interfaces;
using Localization.Service;
using Microsoft.AspNetCore.Mvc;
using System.Linq;


namespace Localization.Controllers
{
    [Route("api/localization")]
    public class LocalizationController : Controller
    {
        ILocalizationService localization;
        public LocalizationController(ILocalizationService _localization)
        {
            localization = _localization;
        }

        [HttpPost]
        public IActionResult TranslatesSelectAll()
        {
            System.Console.WriteLine("localization request");
            try
            {
                var res = localization.GetAllLocalizationByCulture().ToList();
                return Ok(res);
            }
            catch (System.Exception)
            {

                System.Console.WriteLine("error");
                return Ok(null);
            }
        }
    }
}
