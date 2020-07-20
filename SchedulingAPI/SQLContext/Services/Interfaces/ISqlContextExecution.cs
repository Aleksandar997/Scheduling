using Dapper;
using Entity.Base;
using SQLContext.Helpers;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace SQLContext.Services.Interfaces
{
    public interface ISqlContextExecution
    {
        internal Task<ResponseBase<IEnumerable<object>>> Execute(SelectModel selectModel, string connectionString);
        internal Task<SqlReaderBaseModel> ExecuteManual(
            string storedProcedure,
            string connectionString,
            DynamicParameter param = null,
            CommandType? commandType = CommandType.StoredProcedure,
            IDbTransaction transaction = null,
            int? commandTimeout = null
        );
        internal void Dispose();
    }
}


