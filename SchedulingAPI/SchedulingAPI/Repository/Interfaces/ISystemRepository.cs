using Entity.Base;
using SchedulingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface ISystemRepository
    {
        public Task<ResponseBase<IEnumerable<Employee>>> SelectEmployees(int userId);
        public Task<ResponseBase<IEnumerable<Product>>> SelectProducts(int userId);
        public Task<ResponseBase<IEnumerable<ProductType>>> SelectProductTypes();
        public Task<ResponseBase<IEnumerable<OrganizationUnit>>> SelectOrganizationUnits(int userId);
        public Task<ResponseBase<IEnumerable<PricelistType>>> SelectPricelistTypes();
        public Task<ResponseBase<IEnumerable<DocumentStatus>>> SelectDocumentStatuses();
    }
}
