using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Repository.Interfaces;

namespace UserManagement.Repository.Implementations
{
    public class RegisterRepository : RepositoryBase, IRegisterRepository
    {
        public RegisterRepository(string connectionString) : base(connectionString) { }

        public async Task<ResponseBase<int>> Registration(RegisterModel registerModel)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Registration]", new
                {
                    License = registerModel.License.Value,
                    registerModel.User.UserName,
                    registerModel.User.Password,
                    registerModel.User.FirstName,
                    registerModel.User.LastName,
                    registerModel.User.Email,
                    CompanyName = registerModel.User.Company.Name,
                    CompanyLogoId = registerModel.User.Company.FileId
                });
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }
    }
}
