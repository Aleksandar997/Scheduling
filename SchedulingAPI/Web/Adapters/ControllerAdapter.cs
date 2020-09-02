using Common.Attributes;
using Common.Extensions;
using Entity.Base;
using Localization.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.Extensions;

namespace Web.Adapters
{
    public interface CrudControllerRepository<Treturn, Tpaging>
    {
        Task<ResponseBase<IEnumerable<Treturn>>> SelectAll(Tpaging paging, int userId);
        Task<ResponseBase<Treturn>> SelectById(long documentId, int userId);
        Task<ResponseBase<long>> Save(Treturn document, int userId);
        Task<ResponseBase<long>> Delete(long documentId);
    }

    public class CrudControllerBase<Treturn, Tpaging> : ControllerAdapter 
    {
        CrudControllerRepository<Treturn, Tpaging> _repository;
        public CrudControllerBase(ILocalizationService localization, CrudControllerRepository<Treturn, Tpaging> repository) : base(localization)
        {
            _repository = repository;
            var a = GetType().GetMethods().Where(m => m.GetCustomAttributes(typeof(AuthorizeDynamic), false).Length > 0);
        }
        [AuthorizeDynamic("View")]
        [HttpGet("selectAll")]
        public async Task<ResponseBase<IEnumerable<Treturn>>> SelectAll() =>
            await _repository.SelectAll(HttpContext.Request.Query.ToObject<Tpaging>(), UserId);

        [AuthorizeDynamic("View")]
        [HttpGet("selectById/{id}")]
        public async Task<ResponseBase<Treturn>> SelectById(long id) =>
             await _repository.SelectById(id, UserId);

        [AuthorizeDynamic("Add")]
        [HttpPost("save")]
        public async Task<ResponseBase<long>> Save(Treturn document) =>
             await _repository.Save(document, UserId);

        [AuthorizeDynamic("Delete")]
        [HttpDelete("delete/{id}")]
        public async Task<ResponseBase<long>> Delete(long id) =>
             await _repository.Delete(id);
    }
    public class ControllerAdapter : Controller
    {
        protected readonly ILocalizationService Localization;
        protected int UserId;
        protected int EmployeeId;
        //protected bool IsAdmin;
        public ControllerAdapter(ILocalizationService localization)
        {
            Localization = localization;
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            UserId = Convert.ToInt32(User?.Claims.SingleOrDefault(p => p.Type == ClaimTypes.NameIdentifier)?.Value);
            EmployeeId = Convert.ToInt32(User?.Claims.SingleOrDefault(p => p.Type == ClaimTypes.UserData)?.Value);
            //IsAdmin = Convert.ToBoolean(User?.Claims.SingleOrDefault(p => p.Type == ClaimTypes.UserData)?.Value);
            base.OnActionExecuting(context);
        }
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
        }

        protected virtual IActionResult AutoResponse<T>(ResponseBase<T> result)
        {
            if (result.Messages != null)
                result.Messages.ForEach(m =>
                {
                    m.Value = LocalizationService.GetTranslate(m.Code);
                });
            switch (result.Status)
            {
                case ResponseStatus.Success:
                    return Ok(result);
                default:
                    return StatusCode((int)HttpStatusCode.InternalServerError, result);
            }
        }

        protected async virtual Task<IActionResult> AutoResponse<T>(Func<Task<ResponseBase<T>>> result, bool removeChildValidation = false)
        {
            //var a = result.Target.GetType().GetFields().LastOrDefault().GetValue(result.Target);
            //if (removeChildValidation)
            //    ModelState.RemoveChildValidation(a);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var res = await result();
            return AutoResponse(res);
        }

        protected IActionResult ResponseOk<T>(T data, int count = 0)
        {
            return StatusCode((int)HttpStatusCode.OK,
                new ResponseBase<T>()
                {
                    Status = ResponseStatus.Success,
                    Data = data,
                    Count = count
                });
        }
    }
}
