using Entity.Base;
using SchedulingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserManagement.Models;
using User = SchedulingAPI.Models.User;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface ISystemRepository
    {
        public Task<ResponseBase<IEnumerable<User>>> SelectEmployees(int OrganizationUnitId, int userId);
        public Task<ResponseBase<ProductSelectList>> SelectProducts(ProductSelectListInput productSelectListInput, int userId);
        public Task<ResponseBase<IEnumerable<ProductType>>> SelectProductTypes(int userId);
        public Task<ResponseBase<IEnumerable<OrganizationUnit>>> SelectOrganizationUnits(int userId);
        public Task<ResponseBase<IEnumerable<PricelistType>>> SelectPricelistTypes();
        public Task<ResponseBase<IEnumerable<DocumentStatus>>> SelectDocumentStatuses();
        public Task<ResponseBase<IEnumerable<Role>>> SelectRoles(int userId);
    }
}
