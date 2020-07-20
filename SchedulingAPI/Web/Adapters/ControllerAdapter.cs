using Entity.Base;
using Localization.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.Extensions;

namespace Web.Adapters
{
    public class ControllerAdapter : Controller
    {
        protected readonly ILocalizationService Localization;
        protected int UserId;
        public ControllerAdapter(ILocalizationService localization)
        {
            Localization = localization;
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            UserId = Convert.ToInt32(User?.Claims.SingleOrDefault(p => p.Type == ClaimTypes.NameIdentifier)?.Value);
            base.OnActionExecuting(context);
        }
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
        }

        protected async virtual Task<IActionResult> AutoResponse<T>(Func<Task<ResponseBase<T>>> result, bool removeChildValidation = false)
        {
            //var a = result.Target.GetType().GetFields().LastOrDefault().GetValue(result.Target);
            //if (removeChildValidation)
            //    ModelState.RemoveChildValidation(a);
            //if (!ModelState.IsValid)
            //    return BadRequest(ModelState);
            var res = await result();
            res.Messages.ForEach(m =>
            {
                m.Value = LocalizationService.GetTranslate(m.Code);
            });
            switch (res.Status)
            {
                case ResponseStatus.Success:
                    return Ok(res);
                default:
                    return StatusCode((int)HttpStatusCode.InternalServerError, res);
            }
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
