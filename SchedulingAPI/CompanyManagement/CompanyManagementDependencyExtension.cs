using CompanyManagement.Repository;
using Entity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace CompanyManagement
{
    public static class CompanyManagementDependencyExtension
    {
        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddCompanyManagementDependencies(this IServiceCollection services)
        {
            services.AddSingleton<ICompanyRepository, CompanyRepository>(x => new CompanyRepository(connectionString));
        }
    }
}
