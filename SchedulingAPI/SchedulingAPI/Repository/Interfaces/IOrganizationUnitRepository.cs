using Entity.Base;
using SchedulingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface IOrganizationUnitRepository
    {
        //Task<ResponseBase<IEnumerable<OrganizationUnit>>> SelectAll(OrganizationUnitPaging organizationUnitPaging, int userId);
        Task<ResponseBase<OrganizationUnit>> SelectById(int? organizationUnitId, int userId);
        Task<ResponseBase<int>> SaveAsync(OrganizationUnit organizationUnit, int userId);
        Task<ResponseBase<int>> Delete(int? organizationUnitId, int userId);
    }
}
