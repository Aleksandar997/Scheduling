using Common.Extensions;
using Configuration.Models;
using Configuration.Repository.Interfaces;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.Adapters;

namespace Configuration.Controllers
{
    [Route("api/theme")]
    public class ThemeController : ControllerAdapter
    {
        IThemeRepository _themeRepository;
        public ThemeController(ILocalizationService localization, IThemeRepository themeRepository) : base(localization)
        {
            _themeRepository = themeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> SelectAll() =>
            await AutoResponse(() => _themeRepository.SelectAll(UserId));

        [HttpPut]
        public async Task<IActionResult> SetTheme([FromBody]Theme theme) =>
            await AutoResponse(() => _themeRepository.SetTheme(theme, UserId));
    }
}
