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
    [Route("api/schedule")]
    public class ScheduleController : ControllerAdapter
    {
        IScheduleRepository _scheduleRepository;
        public ScheduleController(ILocalizationService localization, IScheduleRepository scheduleRepository) : base(localization)
        {
            _scheduleRepository = scheduleRepository;
        }

        [Authorize]
        [HttpGet("selectScheduleById/{id}")]
        public async Task<IActionResult> SelectScheduleById(int id) =>
            await AutoResponse(() => _scheduleRepository.SelectScheduleById(id, UserId));

        [Authorize]
        [HttpGet("selectSchedulesInMonth")]
        public async Task<IActionResult> SelectSchedulesInMonth() =>
            await AutoResponse(() => _scheduleRepository.SelectSchedulesInMonth(HttpContext.Request.Query.ToObject<SchedulePaging>(), UserId));

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SaveSchedule([FromBody] Document document) =>
            await AutoResponse(() => _scheduleRepository.SaveSchedule(document, UserId), true);

        [Authorize]
        [HttpDelete("scheduleDelete/{id}")]
        public async Task<IActionResult> DeleteSchedule(int id) =>
            await AutoResponse(() => _scheduleRepository.DeleteSchedule(id));
    }
}
