using Common.Base;
using SQLContext.Helpers;
using SQLContext.Models;
using SQLContext.Services.Implementations;
using SQLContext.Services.Interfaces;
using System;
using System.Data;
using System.Threading.Tasks;

namespace SQLContext.Builders
{
    public class ManualSqlBuilder : IDisposable
    {
        private string _connectionString;
        //private ISqlContextExecution _execution = (ISqlContextExecution)DependencyInjectionResolver.ServiceProvider.GetService(typeof(ISqlContextExecution));
        private ISqlContextExecution _execution = new DapperExecution();
        SqlReaderModel sqlReaderModel;
        public ManualSqlBuilder(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void Dispose()
        {
            //sqlReaderModel.Dispose();
            _execution.Dispose();
        }

        public async Task<SqlReaderModel> ExecuteManual(
            string storedProcedure,
            object param = null,
            CommandType? commandType = CommandType.StoredProcedure,
            IDbTransaction transaction = null,
            int? commandTimeout = null
        )
        {
            try
            {
                var dynamicParams = new DynamicParameter(param);
                sqlReaderModel = await _execution.ExecuteManual(storedProcedure, _connectionString, dynamicParams, commandType, transaction, commandTimeout) as SqlReaderModel;
                return sqlReaderModel;
            }
            catch (Exception ex)
            {
                return SqlReaderModel.Error(ex.Message);
            }
        }
    }
}
