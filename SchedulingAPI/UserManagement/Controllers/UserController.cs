using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Service.Interfaces;
using Web.Adapters;

namespace UserManagement.Controllers
{
    [Route("api/framework/user")]
    public class UserController : ControllerAdapter
    {
        private IUserService _userService { get; set; }
        public UserController(ILocalizationService localization, IUserService userService) : base(localization)
        {
            _userService = userService;
        }

        [HttpGet("getUser")]
        public async Task<IActionResult> GetUser() =>
            await AutoResponse(() => _userService.SelectById(UserId));

        //[Authorize(Roles = "User.ChangePassword")]
        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordModel passwordModel) =>
            await AutoResponse(() => _userService.ChangePassword(passwordModel));

        [HttpPost("forgottenPassword")]
        public async Task<IActionResult> ForgottenPassword([FromBody] UserCredentials userCredentials) =>
            await AutoResponse(() => _userService.ForgottenPassword(userCredentials));
    }
}
