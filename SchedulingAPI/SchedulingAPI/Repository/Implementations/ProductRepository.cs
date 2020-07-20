using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Implementations
{
    public class ProductRepository : RepositoryBase, IProductRepository
    {
        public ProductRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<ResponseBase<IEnumerable<Product>>> SelectAll(ProductPaging productPaging, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Product_SelectAll]",
                    new
                    {
                        productPaging.SortBy,
                        productPaging.SortOrder,
                        productPaging.Skip,
                        productPaging.Take,
                        productPaging.Name,
                        productPaging.Code,
                        ProductTypes = ParameterHelper.ToUserDefinedTableType(productPaging.ProductTypes.Select(x => new { value = x }), "IntList"),
                        OrganizationUnits = ParameterHelper.ToUserDefinedTableType(productPaging.OrganizationUnits.Select(x => new { value = x}), "IntList"),
                        userId
                    });
                var a = ReadData(() =>
                {
                    var res = read.Read.Read<Product, ProductType, Product>((product, productType) =>
                    {
                        product.ProductType = productType;
                        return product;
                    }, splitOn: "ProductTypeId");
                    var count = read.Read.ReadFirstOrDefault<int>();
                    return new ResponseBase<IEnumerable<Product>>(res, read.SqlMessages, count);
                });
                return a;
            }
        }

        public async Task<ResponseBase<Product>> SelectById(int? productId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Product_SelectById]", new { productId });
                var a=  ReadData(() =>
                {
                    var product = read.Read.ReadFirstOrDefault<Product>() ?? new Product();
                    product.OrganizationUnits = read.Read.Read<long>().ToList();
                    product.ProductPricelist = read.Read.Read<ProductPricelist>().ToList();
                    return product;
                });
                return a;
            }
        }

        public async Task<ResponseBase<long>> SaveAsync(Product product, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Product_Save]", 
                    new 
                    { 
                        product.ProductId,
                        product.Name,
                        product.Code,
                        product.ProductTypeId,
                        product.Active,
                        OrgUnits = ParameterHelper.ToUserDefinedTableType(product.OrganizationUnits.Select(x => new { value = x }), "IntList"),
                        Pricelist = ParameterHelper.ToUserDefinedTableType(product.ProductPricelist.Select(x => 
                            new
                            {
                                x.OrganizationUnitId,
                                x.DocumentId,
                                DocumentDetailId = x.DocumentDetailId ?? 0,
                                x.Price
                            }
                        ).ToList(), "organization_unit_price"),
                        userId
                    });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }

        public async Task<ResponseBase<int>> Delete(int? productId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Product_Delete]", new { productId });
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }
    }
}
