using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SchedulingAPI.Hubs;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Adapters;

namespace SchedulingAPI.Controllers
{
    [Route("api/schedule")]
    public class ScheduleController : ControllerAdapter
    {
        IScheduleRepository _scheduleRepository;
        IHubContext<SignalHub> _hubContext;
        public ScheduleController(ILocalizationService localization, IScheduleRepository scheduleRepository, IHubContext<SignalHub> hubContext) : base(localization)
        {
            _scheduleRepository = scheduleRepository;
            _hubContext = hubContext;
        }


        [Authorize(Roles = "Schedule.View")]
        [HttpGet("selectScheduleById/{id}")]
        public async Task<IActionResult> SelectScheduleById(int id) =>
            await AutoResponse(() => _scheduleRepository.SelectScheduleById(id, UserId));

        [Authorize(Roles = "Schedule.View")]
        [HttpGet("selectSchedulesInMonth")]
        public async Task<IActionResult> SelectSchedulesInMonth() =>
            await AutoResponse(() => _scheduleRepository.SelectSchedulesInMonth(HttpContext.Request.Query.ToObject<SchedulePaging>(), UserId));

        [Authorize(Roles = "Schedule.Save")]
        [HttpPost]
        public async Task<IActionResult> SaveSchedule([FromBody] Document document)
        {
            var res = await _scheduleRepository.SaveSchedule(document, UserId);
            await NotificationHubManager.Notify(res.Data, document.GetEmployees().Where(x => x != EmployeeId).ToList());
            return AutoResponse(res);
        }

        [Authorize(Roles = "Schedule.Save")]
        [HttpDelete("scheduleDelete/{id}")]
        public async Task<IActionResult> DeleteSchedule(int id) =>
            await AutoResponse(() => _scheduleRepository.DeleteSchedule(id));
    }
}
