using Common.Extensions;
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
using UserManagement.Models;
using User = SchedulingAPI.Models.User;

namespace SchedulingAPI.Repository.Implementations
{
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(string connectionString) : base(connectionString) { }

        public async Task<ResponseBase<IEnumerable<User>>> SelectAll(UserPaging paging, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[User_SelectAll]", new
                {
                    paging.SortBy,
                    paging.SortOrder,
                    paging.Skip,
                    paging.Take,
                    paging.FirstName,
                    paging.LastName,
                    userId
                });
                var a = ReadData(() =>
                {
                    var res = read.Read.Read<User, Employee, User>((user, employee) =>
                    {
                        user.Employee = employee;
                        return user;
                    }, splitOn: "EmployeeId");
                    var count = read.Read.ReadFirstOrDefault<int>();
                    return new ResponseBase<IEnumerable<User>>(res, read.SqlMessages, count);
                });
                return a;
            }
        }

        public async Task<ResponseBase<User>> Save(User user, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[User_Save]", new
                {
                    user.UserId,
                    user.Employee.EmployeeId,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.Password,
                    user.Email,
                    user.Active,
                    Roles = ParameterHelper.ToUserDefinedTableType(user.Roles.Select(x => new { value = x.RoleId }), "IntList"),
                    OrganizationUnits = ParameterHelper.ToUserDefinedTableType(user.Employee.OrganizationUnits.IfNull().Select(x => new { value = x }), "IntList"),
                    Products = ParameterHelper.ToUserDefinedTableType(user.Employee.Products.IfNull().Select(x => new { value = x }), "IntList"),
                    user.Employee.IdentificationNumber,
                    sysUserId = userId
                });
                var a = ReadData(() => read.Read.ReadFirst<User>());
                return a;
            }
        }

        public async Task<ResponseBase<User>> SelectById(int userId, int sysUserId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[User_SelectById]", new { userId, sysUserId });
                return ReadData(() =>
                {
                    var res = read.Read.Read<User, Employee, User>((user, employee) =>
                    {
                        user.Employee = employee;
                        return user;
                    }, splitOn: "EmployeeId").FirstOrDefault();
                    res.Roles = read.Read.Read<Role>().ToList();
                    if (res.Employee != null)
                    {
                        var productsOrgUnits = read.Read.Read<EmployeeOrganizationUnitProduct>().ToList();
                        res.Employee.Products = productsOrgUnits.Select(x => x.ProductId).ToList();
                        res.Employee.OrganizationUnits = productsOrgUnits.Select(x => x.OrganizationUnitId).ToList();
                        //res.Employee.Products = read.Read.Read<long>().ToList();
                        //res.Employee.OrganizationUnits = read.Read.Read<int>().ToList();
                    }
                    return res;
                });
            }
        }
        public async Task<ResponseBase<int>> Delete(int userId, int sysUserId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[User_Delete]", new { userId, sysUserId });
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }
    }
}
