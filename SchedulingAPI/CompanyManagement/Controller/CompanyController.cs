using CompanyManagement.Models;
using CompanyManagement.Repository;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.Adapters;

namespace CompanyManagement.Controller
{

    [Route("api/framework/company")]
    public class CompanyController : ControllerAdapter
    {
        ICompanyRepository _companyRepository;
        public CompanyController(ILocalizationService localization, ICompanyRepository companyRepository) : base(localization)
        {
            _companyRepository = companyRepository;
        }

        //[Authorize(Roles = "Customer.Save")]
        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] Company company) =>
            await AutoResponse(() => _companyRepository.Save(company, UserId));

        //[Authorize(Roles = "Customer.View")]
        [HttpGet("getCompany")]
        public async Task<IActionResult> SelectCustomers() =>
            await AutoResponse(() => _companyRepository.SelectCompany(UserId));
    }
 
}
