using CodebookManagement.Models;
using CodebookManagement.Service;
using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Repository.Interfaces;
using Web.Adapters;
using Web.Extensions;

namespace UserManagement.Controllers
{
    [Route("api/role")]
    public class RoleController : ControllerAdapter
    {
        ICodebookService _codebookService;
        IRoleRepository _roleRepository;
        public RoleController(ILocalizationService localization, ICodebookService codebookService, IRoleRepository roleRepository) : base(localization)
        {
            _codebookService = codebookService;
            _roleRepository = roleRepository;
        }

        [Authorize(Roles = "Role.View")]
        [HttpGet("selectAll")]
        public async Task<IActionResult> RoleSelectAll()
        {
            var paging = HttpContext.Request.Query.ToObject<CodebookPaging>().Process(UserId);
            return await AutoResponse(() => _codebookService.SelectAll<Role>(x =>
                (paging.Code == null || x.Code.ContainsIgnoreCase(paging.Code)) &&
                (paging.Name == null || x.Name.ContainsIgnoreCase(paging.Name)) &&
                x.User.UserId == UserId,
            paging));
        }

        [Authorize(Roles = "Role.View")]
        [HttpGet("{id}")]
        public async Task<IActionResult> RoleSelectById(int id) =>
            await AutoResponse(() => _roleRepository.SelectById(id, UserId));

        [Authorize(Roles = "Role.Save")]
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] Role role) =>
            await AutoResponse(() => 
            {
                ModelState.RemoveChildValidation(role);
                return _roleRepository.Save(role, UserId);
            });
    }
}
