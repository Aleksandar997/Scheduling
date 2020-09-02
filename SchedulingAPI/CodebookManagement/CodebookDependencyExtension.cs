using CodebookManagement.Repository;
using CodebookManagement.Service;
using Common.Base;
using Entity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace CodebookManagement
{
    public static class CodebookDependencyExtension
    {
        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddCodebookDependencies(this IServiceCollection services)
        {
            services.AddSingleton<ICodebookRepository, CodebookRepository>(c => new CodebookRepository(connectionString));
            services.AddSingleton<ICodebookService, CodebookService>(c => new CodebookService(DependencyInjectionResolver.GetService<ICodebookRepository>()));
        }
    }
}
