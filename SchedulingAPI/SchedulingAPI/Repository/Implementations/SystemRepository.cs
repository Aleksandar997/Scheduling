using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserManagement.Models;

namespace SchedulingAPI.Repository.Implementations
{
    public class SystemRepository : RepositoryBase, ISystemRepository
    {
        public SystemRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<ResponseBase<IEnumerable<OrganizationUnit>>> SelectOrganizationUnits(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[OrganizationUnit_SelectList]", new { userId });
                return ReadData(() => read.Read.Read<OrganizationUnit>());
            }
        }

        public async Task<ResponseBase<IEnumerable<Product>>> SelectProducts(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Product_SelectList]", new { userId });
                return ReadData(() =>
                {
                    var products = read.Read.Read<Product>().ToList();
                    var productPricelist = read.Read.Read<ProductPricelist>();
                    products.ForEach(x => x.ProductPricelist = productPricelist.Where(pp => pp.ProductId == x.ProductId).ToList());
                    return products.AsEnumerable();
                });
            }
        }

        public async Task<ResponseBase<IEnumerable<ProductType>>> SelectProductTypes()
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[ProductType_SelectList]");
                return ReadData(() => read.Read.Read<ProductType>());
            }
        }

        public async Task<ResponseBase<IEnumerable<Employee>>> SelectEmployees(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Employee_SelectList]", new { userId });
                return ReadData(() =>
                    read.Read.Read<Employee, User, Employee>((employee, user) =>
                    {
                        employee.User = user;
                        return employee;
                    }, splitOn: "UserId")
                );
            }
        }

        public async Task<ResponseBase<IEnumerable<PricelistType>>> SelectPricelistTypes()
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[PricelistType_SelectList]");
                return ReadData(() => read.Read.Read<PricelistType>());
            }
        }

        public async Task<ResponseBase<IEnumerable<DocumentStatus>>> SelectDocumentStatuses()
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[DocumentStatus_SelectList]");
                return ReadData(() => read.Read.Read<DocumentStatus>());
            }
        }
    }
}
