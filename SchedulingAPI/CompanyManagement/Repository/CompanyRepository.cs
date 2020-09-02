using CompanyManagement.Models;
using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CompanyManagement.Repository
{
    public class CompanyRepository : RepositoryBase, ICompanyRepository
    {
        public CompanyRepository(string connectionString) : base(connectionString) { }
        public async Task<ResponseBase<Company>> Save(Company company, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Company_Save]",
                    new
                    {
                        company.Name,
                        company.FileId,
                        userId
                    }
                );
                return ReadData(() => read.Read.ReadFirst<Company>());
            }
        }

        public async Task<ResponseBase<Company>> SelectCompany(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Company_Select]", new { userId });
                return ReadData(() => read.Read.ReadFirst<Company>());
            }
        }
    }
}
