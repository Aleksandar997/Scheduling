using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Implementations
{
    public class OrganizationUnitRepository : RepositoryBase, IOrganizationUnitRepository
    {
        public OrganizationUnitRepository(string connectionString) : base(connectionString)
        {
        }

        //public async Task<ResponseBase<IEnumerable<OrganizationUnit>>> SelectAll(CodebookPaging organizationUnitPaging, int userId)
        //{
        //    using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
        //    {
        //        var read = await reader.ExecuteManual("[dbo].[OrganizationUnit_SelectAll]",
        //            new
        //            {
        //                organizationUnitPaging.SortBy,
        //                organizationUnitPaging.SortOrder,
        //                organizationUnitPaging.Skip,
        //                organizationUnitPaging.Take,
        //                organizationUnitPaging.Name,
        //                organizationUnitPaging.Code,
        //                userId
        //            });
        //        return ReadData(() => read.Read.Read<OrganizationUnit>());
        //    }
        //}

        public async Task<ResponseBase<OrganizationUnit>> SelectById(int? organizationUnitId, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[OrganizationUnit_SelectById]", new { organizationUnitId, userId });
                return ReadData(() => read.Read.ReadFirst<OrganizationUnit>());
            }
        }

        public async Task<ResponseBase<int>> SaveAsync(OrganizationUnit organizationUnit, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[OrganizationUnit_Save]",
                    new
                    {
                        organizationUnit.OrganizationUnitId,
                        organizationUnit.Name,
                        organizationUnit.Code,
                        organizationUnit.Active,
                        userId
                    });
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }

        public async Task<ResponseBase<int>> Delete(int? organizationUnitId, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[OrganizationUnit_Delete]", new { organizationUnitId, userId });
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }
    }
}
