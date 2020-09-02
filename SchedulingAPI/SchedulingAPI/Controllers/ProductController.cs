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
    [Route("api/product")]
    public class ProductController : ControllerAdapter
    {
        IProductRepository _productRepository;
        public ProductController(ILocalizationService localization, IProductRepository productRepository) : base(localization)
        {
            _productRepository = productRepository;
        }
        [Authorize(Roles = "Product.View")]
        [HttpGet("selectAll")]
        public async Task<IActionResult> SelectAll() =>
            await AutoResponse(() => _productRepository.SelectAll(HttpContext.Request.Query.ToObject<ProductPaging>(), UserId));

        [Authorize(Roles = "Product.View")]
        [HttpGet("selectById")]
        public async Task<IActionResult> SelectById() =>
            await AutoResponse(() => _productRepository.SelectById(HttpContext.Request.Query.ToObject<int?>()));

        [Authorize(Roles = "Product.Save")]
        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] Product product) =>
            await AutoResponse(() => _productRepository.SaveAsync(product, UserId));

        [Authorize(Roles = "Product.Delete")]
        [HttpDelete("deleteProduct/{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await AutoResponse(() => _productRepository.Delete(id));
    }
}
