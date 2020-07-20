using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Repository.Interfaces;
using System.Threading.Tasks;
using Web.Adapters;

namespace SchedulingAPI.Controllers
{
    [Route("api/system")]
    public class SystemController : ControllerAdapter
    {
        ISystemRepository _systemRepository;
        public SystemController(ILocalizationService localization, ISystemRepository systemRepository) : base(localization)
        {
            _systemRepository = systemRepository;
        }

        [Authorize]
        [HttpGet("selectEmployees")]
        public async Task<IActionResult> SelectEmployees() =>
            await AutoResponse(() => _systemRepository.SelectEmployees(UserId));

        [Authorize]
        [HttpGet("selectProducts")]
        public async Task<IActionResult> SelectProducts() =>
            await AutoResponse(() => _systemRepository.SelectProducts(UserId));

        [Authorize]
        [HttpGet("selectProductTypes")]
        public async Task<IActionResult> SelectProductTypes() =>
            await AutoResponse(() => _systemRepository.SelectProductTypes());

        [Authorize]
        [HttpGet("selectOrganizationUnits")]
        public async Task<IActionResult> SelectOrganizationUnits() =>
            await AutoResponse(() => _systemRepository.SelectOrganizationUnits(UserId));

        [Authorize]
        [HttpGet("selectPricelistsTypes")]
        public async Task<IActionResult> SelectPricelistsTypes() =>
            await AutoResponse(() => _systemRepository.SelectPricelistTypes());

        [Authorize]
        [HttpGet("selectDocumentStatuses")]
        public async Task<IActionResult> SelectDocumentStatuses() =>
            await AutoResponse(() => _systemRepository.SelectDocumentStatuses());
    }
}
