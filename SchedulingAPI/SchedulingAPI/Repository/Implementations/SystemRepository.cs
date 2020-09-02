using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Helpers;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserManagement.Models;
using User = SchedulingAPI.Models.User;

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

        public async Task<ResponseBase<ProductSelectList>> SelectProducts(ProductSelectListInput productSelectListInput, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Product_SelectList]", new 
                { 
                    organizationUnits = ParameterHelper.ToUserDefinedTableType((productSelectListInput.OrganizationUnits ?? new List<int>()).Select(x => new { value = x }), "IntList"),
                    userId,
                    productSelectListInput.AllOrgUnits
                });
                return ReadData(() =>
                {
                    var products = read.Read.Read<Product>().ToList();
                    var productPricelist = read.Read.Read<ProductPricelist>().ToList();
                    var productsByOrgUnits = read.Read.Read<EmployeeOrganizationUnitProduct>().ToList();
                    //var productsDetails = read.Read.Read<ProductsDetails>().ToList();
                    //products.ForEach(x => x.ProductPricelist = productPricelist.Where(pp => pp.ProductId == x.ProductId).ToList());

                    return new ProductSelectList(products, productPricelist, productsByOrgUnits);
                    //return products.AsEnumerable();
                });
            }
        }

        public async Task<ResponseBase<IEnumerable<ProductType>>> SelectProductTypes(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[ProductType_SelectList]", new { userId });
                return ReadData(() => read.Read.Read<ProductType>());
            }
        }

        public async Task<ResponseBase<IEnumerable<User>>> SelectEmployees(int OrganizationUnitId, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Employee_SelectList]", new 
                {
                    OrganizationUnitId,
                    userId 
                });
                return ReadData(() =>
                    read.Read.Read<Employee, User, User>((employee, user) =>
                    {
                        user.Employee = employee;
                        return user;
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

        public async Task<ResponseBase<IEnumerable<Role>>> SelectRoles(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Role_SelectList]", new { userId });
                return ReadData(() => read.Read.Read<Role>());
            }
        }
    }
}
