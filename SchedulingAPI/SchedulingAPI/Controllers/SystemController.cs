using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Models;
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

        [Authorize(Roles = "Employee.SelectList")]
        [HttpGet("selectEmployees")]
        public async Task<IActionResult> SelectEmployees() =>
            await AutoResponse(() => _systemRepository.SelectEmployees(HttpContext.Request.Query.ToObject<int>(), UserId));

        [Authorize(Roles = "Product.SelectList")]
        [HttpGet("selectProducts")]
        public async Task<IActionResult> SelectProducts() =>
            await AutoResponse(() => _systemRepository.SelectProducts(HttpContext.Request.Query.ToObject<ProductSelectListInput>(), UserId));

        [Authorize(Roles = "ProductType.SelectList")]
        [HttpGet("selectProductTypes")]
        public async Task<IActionResult> SelectProductTypes() =>
            await AutoResponse(() => _systemRepository.SelectProductTypes(UserId));

        [Authorize(Roles = "Product.SelectList")]
        [HttpGet("selectOrganizationUnits")]
        public async Task<IActionResult> SelectOrganizationUnits() =>
            await AutoResponse(() => _systemRepository.SelectOrganizationUnits(UserId));

        [Authorize(Roles = "PricelistsType.SelectList")]
        [HttpGet("selectPricelistsTypes")]
        public async Task<IActionResult> SelectPricelistsTypes() =>
            await AutoResponse(() => _systemRepository.SelectPricelistTypes());

        [Authorize(Roles = "DocumentStatus.SelectList")]
        [HttpGet("selectDocumentStatuses")]
        public async Task<IActionResult> SelectDocumentStatuses() =>
            await AutoResponse(() => _systemRepository.SelectDocumentStatuses());

        [Authorize(Roles = "Role.SelectList")]
        [HttpGet("selectRoles")]
        public async Task<IActionResult> SelectRoles() =>
            await AutoResponse(() => _systemRepository.SelectRoles(UserId));

    }
}
