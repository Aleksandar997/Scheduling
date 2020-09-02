using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SchedulingAPI.Services.Interfaces;
using System.Threading.Tasks;
using Web.Adapters;

namespace SchedulingAPI.Controllers
{
    [Route("api/user")]
    public class UserController : ControllerAdapter
    {
        IUserService _userService;
        public UserController(ILocalizationService localization, IUserService userService) : base(localization)
        {
            _userService = userService;
        }

        [Authorize(Roles = "User.View")]
        [HttpGet("selectAll")]
        public async Task<IActionResult> SelectAll() =>
            await AutoResponse(() => _userService.SelectAll(HttpContext.Request.Query.ToObject<UserPaging>(), UserId));

        [Authorize(Roles = "User.Save")]
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] User user) =>
            await AutoResponse(() => _userService.Save(user, UserId));

        [Authorize(Roles = "User.View")]
        [HttpGet("selectById")]
        public async Task<IActionResult> SelectById() =>
            await AutoResponse(() => _userService.SelectById(HttpContext.Request.Query.ToObject<int>(), UserId));

        [Authorize(Roles = "User.Delete")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await AutoResponse(() => _userService.Delete(id, UserId));
    }
}
