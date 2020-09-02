using Entity.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SchedulingAPI.Models
{
    public class Product
    {
        [PrimaryKey]
        public long? ProductId { get; set; }
        public int? ProductTypeId { get; set; }
        public ProductType ProductType { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool Active { get; set; }
        public decimal? Price { get; set; }
        public long? OrganizationUnitId { get; set; }
        public List<ProductPricelist> ProductPricelist { get; set; }
        public List<long> OrganizationUnits { get; set; }
        public string OrganizationUnitsString { get; set; }
    }
    public class ProductPaging : BasePaging
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public List<int> OrganizationUnits = new List<int>();
        public List<int> ProductTypes = new List<int>();
    }

    public class ProductPricelist
    {
        public long? ProductId { get; set; }
        public long? DocumentId { get; set; }
        public int? OrganizationUnitId { get; set; }
        public string OrganizationUnitName { get; set; }
        public decimal? Price { get; set; }
        public long? DocumentDetailId { get; set; }
    }

    public class EmployeeOrganizationUnitProduct
    {
        public long ProductId { get; set; }
        public string Name { get; set; }
        public int OrganizationUnitId { get; set; }
        public int EmployeeId { get; set; }
    }

    //public class ProductsDetails
    //{
    //    public long? ProductId { get; set; }
    //    public string Name { get; set; }
    //    public int? OrganizationUnitId { get; set; }
    //    public string EmployeesString
    //    {
    //        set => Employees = value.Split(",").ToList().Select(x => Convert.ToInt64(x.Trim())).ToList();
    //    }
    //    public List<long> Employees { get; set; }
    //}

    public class ProductSelectList
    {
        public List<Product> Products { get; set; }
        public List<ProductPricelist> ProductPricelist { get; set; }
        public List<EmployeeOrganizationUnitProduct> ProductsByOrgUnit { get; set; }
        public ProductSelectList(List<Product> products,  List<ProductPricelist> productPricelist, List<EmployeeOrganizationUnitProduct> productsByOrgUnit)
        {
            Products = products;
            ProductPricelist = productPricelist;
            ProductsByOrgUnit = productsByOrgUnit;
        }
    }

    public class ProductSelectListInput
    {
        public List<int> OrganizationUnits { get; set; } = new List<int>();
        public bool AllOrgUnits { get; set; }
    }
}