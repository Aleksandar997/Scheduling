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
    [Route("api/customer")]
    public class CustomerController : ControllerAdapter
    {
        ICustomerRepository _customerRepository;
        public CustomerController(ILocalizationService localization, ICustomerRepository customerRepository) : base(localization)
        {
            _customerRepository = customerRepository;
        }

        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] Customer customer) =>
            await AutoResponse(() => _customerRepository.Save(customer, UserId));

        [Authorize]
        [HttpGet("selectAll")]
        public async Task<IActionResult> SelectCustomers() =>
            await AutoResponse(() => _customerRepository.SelectAll(UserId));

        [Authorize]
        [HttpGet("selectbyId/{id}")]
        public async Task<IActionResult> SelectbyId(int id) =>
            await AutoResponse(() => _customerRepository.SelectById(id));
    }
}
