using Entity.Base;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using UserManagement.Models;

namespace UserManagement.Service.Interfaces
{
    public interface IRegisterService
    {
        Task<ResponseBase<int>> Registration(RegisterModel registerModel);
    }
}
