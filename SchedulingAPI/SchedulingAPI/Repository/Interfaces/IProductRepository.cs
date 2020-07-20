using Entity.Base;
using SchedulingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface IProductRepository
    {
        Task<ResponseBase<IEnumerable<Product>>> SelectAll(ProductPaging productPaging, int userId);
        Task<ResponseBase<Product>> SelectById(int? productId);
        Task<ResponseBase<long>> SaveAsync(Product product, int userId);
        Task<ResponseBase<int>> Delete(int? productId);
    }
}
