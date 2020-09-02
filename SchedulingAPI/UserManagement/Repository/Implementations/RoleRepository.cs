using Common.Extensions;
using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Repository.Interfaces;

namespace UserManagement.Repository.Implementations
{
    public class RoleRepository : RepositoryBase, IRoleRepository
    {
        public RoleRepository(string connectionString) : base(connectionString) { }

        public async Task<ResponseBase<Role>> SelectById(int roleId, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Role_SelectById]", new
                {
                    roleId,
                    userId
                });
                return ReadData(() =>
                {
                    var role = roleId > 0 ? read.Read.ReadFirst<Role>() : new Role();
                    role.Menus = read.Read.Read<Menu>().ToTreeView(x => x.MenuId, x => x.OrderBy(y => y.Sort).ToList());
                    role.Permissions = read.Read.Read<Permission>().ToTreeView(x => x.PermissionId);
                    return role;
                });
            }
        }

        public async Task<ResponseBase<int>> Save(Role role, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Role_Save]",
                    new
                    {
                        role.RoleId,
                        role.Name,
                        role.Code,
                        role.Active,
                        Permissions = ParameterHelper.ToUserDefinedTableType(role.Permissions.Where(x => x.Active).Select(x => new { value = x.PermissionId }), "IntList"),
                        Menus = ParameterHelper.ToUserDefinedTableType(role.Menus.Where(x => x.Active).Select(x => new { value = x.MenuId }), "IntList"),
                        userId
                    }
                );
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }
    }

}
