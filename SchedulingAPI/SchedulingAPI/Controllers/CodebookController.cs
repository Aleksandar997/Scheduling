using CodebookManagement.Models;
using CodebookManagement.Service;
using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Models;
using System.Threading.Tasks;
using Web.Adapters;
using System.Linq;
using Web.Extensions;

namespace SchedulingAPI.Controllers
{
    [Route("api/codebook")]
    public class CodebookController : ControllerAdapter
    {
        ICodebookService _codebookService;
        public CodebookController(ILocalizationService localization, ICodebookService codebookService) : base(localization)
        {
            _codebookService = codebookService;
        }

        [Authorize(Roles = "DocumentType.View")]
        [HttpGet("documentType/selectAll")]
        public async Task<IActionResult> DocumentTypeSelectAll()
        {
            var paging = HttpContext.Request.Query.ToObject<CodebookPaging>().Process(UserId);
            return await AutoResponse(() => _codebookService.SelectAll<DocumentType>(x =>
                (paging.Code == null || x.Code.ContainsIgnoreCase(paging.Code)) && 
                (paging.Name == null || x.Name.ContainsIgnoreCase(paging.Name)) &&
                x.DocumentTypeCompany.User.UserId == UserId, 
            paging));
        }

        [Authorize(Roles = "ProductType.View")]
        [HttpGet("productType/selectAll")]
        public async Task<IActionResult> ProductTypeSelectAll()
        {
            var paging = HttpContext.Request.Query.ToObject<CodebookPaging>().Process(UserId);
            return await AutoResponse(() => _codebookService.SelectAll<ProductType>(x =>
                (paging.Code == null || x.Code.ContainsIgnoreCase(paging.Code)) && 
                (paging.Name == null || x.Name.ContainsIgnoreCase(paging.Name)) &&
                x.User.UserId == UserId,
            paging));
        }
        [Authorize(Roles = "OrganizationUnit.View")]
        [HttpGet("organizationUnit/selectAll")]
        public async Task<IActionResult> OrganizationUnitSelectAll()
        {
            var paging = HttpContext.Request.Query.ToObject<CodebookPaging>();
            return await AutoResponse(() => _codebookService.SelectAll<OrganizationUnit>(x =>
                (paging.Code == null || x.Code.ContainsIgnoreCase(paging.Code)) &&
                (paging.Name == null || x.Name.ContainsIgnoreCase(paging.Name)) &&
                x.User.UserId == UserId,
            paging));
        }

        [Authorize(Roles = "OrganizationUnit.View")]
        [HttpGet("organizationUnit/selectById/{id}")]
        public async Task<IActionResult> OrganizationUnitSelectById(int id) =>
             await AutoResponse(() => _codebookService.SelectById<OrganizationUnit>(x => x.OrganizationUnitId == id && x.User.UserId == UserId));

        [Authorize(Roles = "DocumentType.View")]
        [HttpGet("documentType/selectById/{id}")]
        public async Task<IActionResult> DocumentTypeSelectById(int id) =>
            await AutoResponse(() => _codebookService.SelectById<DocumentType>(x => x.DocumentTypeId == id && x.DocumentTypeCompany.User.UserId == UserId));

        [Authorize(Roles = "ProductType.View")]
        [HttpGet("productType/selectById/{id}")]
        public async Task<IActionResult> ProductTypeSelectById(int id) =>
            await AutoResponse(() => _codebookService.SelectById<ProductType>(x => x.ProductTypeId == id && x.User.UserId == UserId));

        [Authorize(Roles = "DocumentType.Save")]
        [HttpPost("documentType/save")]
        public async Task<IActionResult> DocumentTypeSave([FromBody] DocumentType documentType)
        {
            ModelState.RemoveChildValidation(documentType.DocumentTypeCompany);
            return await AutoResponse(() => _codebookService.Save(documentType));
        }
        [Authorize(Roles = "ProductType.Save")]
        [HttpPost("productType/save")]
        public async Task<IActionResult> ProductTypeSave([FromBody] ProductType productType)
        {
            ModelState.RemoveChildValidation(productType);
            return await AutoResponse(() => _codebookService.Save(productType));
        }

        [Authorize(Roles = "OrganizationUnit.Save")]
        [HttpPost("organizationUnit/save")]
        public async Task<IActionResult> OrganizationUnitSave([FromBody] OrganizationUnit organizationUnit)
        {
            ModelState.RemoveChildValidation(organizationUnit);
            return await AutoResponse(() => _codebookService.Save(organizationUnit));
        }

        [Authorize(Roles = "Customer.Save")]
        [HttpPost("customer/save")]
        public async Task<IActionResult> Save([FromBody] Customer customer) 
        {
            ModelState.RemoveChildValidation(customer);
            return await AutoResponse(() => _codebookService.Save(customer));
        }

        [Authorize(Roles = "Customer.View")]
        [HttpGet("customer/selectAll")]
        public async Task<IActionResult> CustomerSelectAll()
        {
            var paging = HttpContext.Request.Query.ToObject<CustomerPaging>();
            return await AutoResponse(() => _codebookService.SelectAll<Customer>(x =>
                (paging.FirstName == null || x.FirstName.ContainsIgnoreCase(paging.FirstName)) &&
                (paging.LastName == null || x.FirstName.ContainsIgnoreCase(paging.LastName)) &&
                (paging.PhoneNumber == null || x.PhoneNumber.ContainsIgnoreCase(paging.PhoneNumber)) &&
                x.User.UserId == UserId,
            paging));
        }

        [Authorize(Roles = "Customer.View")]
        [HttpGet("customer/selectById/{id}")]
        public async Task<IActionResult> CustomerSelectById(int id) =>
            await AutoResponse(() => _codebookService.SelectById<Customer>(x => x.CustomerId == id && x.User.UserId == UserId));

    }
}
