using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;

namespace UserManagement.Repository.Interfaces
{
    public interface IRegisterRepository
    {
        public Task<ResponseBase<int>> Registration(RegisterModel registerModel);
    }
}
