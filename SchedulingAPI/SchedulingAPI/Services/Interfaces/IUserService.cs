using Entity.Base;
using SchedulingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<ResponseBase<IEnumerable<User>>> SelectAll(UserPaging paging, int userId);
        Task<ResponseBase<User>> Save(User user, int userId);
        Task<ResponseBase<User>> SelectById(int userId, int sysUserId);
        Task<ResponseBase<int>> Delete(int userId, int sysUserId);
    }
}
