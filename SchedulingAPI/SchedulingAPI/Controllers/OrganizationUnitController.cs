using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Adapters;

namespace SchedulingAPI.Controllers
{
    [Route("api/organizationUnit")]
    public class OrganizationUnitController : ControllerAdapter
    {
        IOrganizationUnitRepository _organizationUnitRepository;
        public OrganizationUnitController(ILocalizationService localization, IOrganizationUnitRepository organizationUnitRepository) : base(localization)
        {
            _organizationUnitRepository = organizationUnitRepository;
        }
        //[Authorize]
        //[HttpGet("selectAll")]
        //public async Task<IActionResult> SelectAll() =>
        //    await AutoResponse(() => _organizationUnitRepository.SelectAll(HttpContext.Request.Query.ToObject<OrganizationUnitPaging>(), UserId));

        [Authorize]
        [HttpGet("selectById")]
        public async Task<IActionResult> SelectById() =>
            await AutoResponse(() => _organizationUnitRepository.SelectById(HttpContext.Request.Query.ToObject<int?>(), UserId));

        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] OrganizationUnit organizationUnit) =>
            await AutoResponse(() => _organizationUnitRepository.SaveAsync(organizationUnit, UserId));

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await AutoResponse(() => _organizationUnitRepository.Delete(id, UserId));
    }
}
