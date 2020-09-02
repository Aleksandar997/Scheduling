using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;

namespace UserManagement.Service.Interfaces
{
    public interface IUserService
    {
        Task<ResponseBase<User>> SelectById(long userId = 0);
        Task<ResponseBase<long>> ForgottenPassword(UserCredentials userCredentials);
        Task<ResponseBase<long>> ChangePassword(PasswordModel passwordModel);
        string GeneratePassword();
        Task SendMail(UserCredentials userCredentials);
    }
}
