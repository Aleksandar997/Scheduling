using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;

namespace UserManagement.Repository.Interfaces
{
    public interface IUserRepository
    {
        Task<ResponseBase<User>> SelectById(long userId = 0);
        Task<ResponseBase<User>> LoginUser(string username, string password, int cultureId);
        Task<ResponseBase<long>> ForgottenPassword(UserCredentials userCredentials);
        Task<ResponseBase<long>> ChangePassword(PasswordModel passwordModel);
    }
}
