using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using System.Threading.Tasks;
using UserManagement.Models;
using Web.Adapters;


namespace SchedulingAPI.Controllers
{
    [Route("api/chart")]
    public class ChartController : ControllerAdapter
    {
        IChartRepository _chartRepository;
        public ChartController(ILocalizationService localization, IChartRepository chartRepository) : base(localization)
        {
            _chartRepository = chartRepository;
        }

        [Authorize]
        [HttpGet("mostSoldProductsAndServices/get")]
        public async Task<IActionResult> SelectMostSoldProductsAndServices() =>
            await AutoResponse(() => _chartRepository.SelectChartData(UserId, "[dbo].[Chart_MostSoldProductsAndServices]"));

        [Authorize]
        [HttpPut("updatePosition")]
        public async Task<IActionResult> UpdatePosition([FromBody] ChartMetaData chartMetaData) =>
            await AutoResponse(() => _chartRepository.SetDragPosition(chartMetaData, UserId));


        [Authorize]
        [HttpGet("organizationUnitBySales/get")]
        public async Task<IActionResult> SelectOrganizationUnitBySales() =>
            await AutoResponse(() => _chartRepository.SelectChartData(UserId, "[dbo].[Chart_OrganizationUnitBySales]"));


        [Authorize]
        [HttpGet("saleInLast12MonthsByProduct/get")]
        public async Task<IActionResult> SelectSaleInLast12MonthsByProduct() =>
            await AutoResponse(() => _chartRepository.SelectChartGroupedData(UserId, "[dbo].[Chart_SaleInLast12MonthsByProduct]"));

        [Authorize]
        [HttpGet("averageSaleDuringDayByHours/get")]
        public async Task<IActionResult> SelectAverageSaleDuringDayByHours() =>
            await AutoResponse(() => _chartRepository.SelectChartGroupedData(UserId, "[dbo].[Chart_AverageSaleDuringDayByHours]"));
        //[Authorize]
        //[HttpGet("metaData")]
        //public async Task<IActionResult> SelectMetaData() =>
        //    await AutoResponse(() => _chartRepository.SelectMetaData(UserId));
    }

}
