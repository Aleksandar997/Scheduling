using Entity.Base;
using FileManagement;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Repository.Interfaces;
using UserManagement.Service.Interfaces;

namespace UserManagement.Service.Implementations
{
    public class RegisterService : IRegisterService
    {
        IRegisterRepository _registerRepository;
        public RegisterService(IRegisterRepository registerRepository)
        {
            _registerRepository = registerRepository;
        }

        public async Task<ResponseBase<int>> Registration(RegisterModel registerModel)
        {
            //registerModel.User.Company.FileId = await context.UploadFile();
            return await _registerRepository.Registration(registerModel);
        }
    }
}
