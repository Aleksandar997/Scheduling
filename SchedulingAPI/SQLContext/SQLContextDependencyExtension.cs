using Microsoft.Extensions.DependencyInjection;
using SQLContext.Services.Implementations;
using SQLContext.Services.Interfaces;
using System;

namespace SQLContext
{
    public static class SQLContextDependencyExtension
    {
        public static void AddSQLContextDependencies<
            ExecutionService, 
            SelectClauseService, 
            WhereClauseService, 
            OrderByClauseService, 
            JoinClauseService>(this IServiceCollection services) 
                where ExecutionService : class, ISqlContextExecution
                where SelectClauseService : class, ISelectClauseService
                where WhereClauseService : class, IWhereClauseService
                where OrderByClauseService : class, IOrderByClauseService
                where JoinClauseService : class, IJoinClauseService

        {
            services.AddSingleton<ISqlContextExecution, ExecutionService>(x => Activator.CreateInstance<ExecutionService>());
            services.AddSingleton<ISelectClauseService, SelectClauseService>(x => Activator.CreateInstance<SelectClauseService>());
            services.AddSingleton<IWhereClauseService, WhereClauseService>(x => Activator.CreateInstance<WhereClauseService>());
            services.AddSingleton<IOrderByClauseService, OrderByClauseService>(x => Activator.CreateInstance<OrderByClauseService>());
            services.AddSingleton<IJoinClauseService, JoinClauseService>(x => Activator.CreateInstance<JoinClauseService>());
        }

        public static void AddSQLContextDependencies(this IServiceCollection services)

        {
            services.AddSingleton<ISqlContextExecution, DapperExecution>(x => new DapperExecution());
            services.AddSingleton<ISelectClauseService, SelectClauseService>(x => new SelectClauseService());
            services.AddSingleton<IWhereClauseService, WhereClauseService>(x => new WhereClauseService());
            services.AddSingleton<IOrderByClauseService, OrderByClauseService>(x => new OrderByClauseService());
            services.AddSingleton<IJoinClauseService, JoinClauseService>(x => new JoinClauseService());
        }
    }
}
