using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;

namespace UserManagement.Repository.Interfaces
{
    public interface IRoleRepository
    {
        Task<ResponseBase<Role>> SelectById(int roleId, int userId);
        Task<ResponseBase<int>> Save(Role role, int userId);
    }
}
