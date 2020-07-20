using Common.Extensions;
using Dapper;
using Entity.Base;
using SQLContext.Extensions;
using SQLContext.Helpers;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace SQLContext.Services.Implementations
{
    public class DapperExecution : ISqlContextExecution
    {
        Connection connection { get; set; }
        SqlMapper.GridReader reader;
        async Task<SqlReaderBaseModel> ISqlContextExecution.ExecuteManual(
            string storedProcedure, 
            string connectionString,
            DynamicParameter param,
            CommandType? commandType,
            IDbTransaction transaction,
            int? commandTimeout
        )
        {
            try
            {
                connection = Connection.CreateConnection(connectionString, storedProcedure);
                connection.DbConnection.Open();
                reader = await connection.DbConnection.QueryMultipleAsync(storedProcedure, param, transaction, commandTimeout, commandType);
                return new SqlReaderModel(reader, connection.Messages);
            }
            catch (Exception ex)
            {
                return SqlReaderModel.Error(ex.Message);
            }
        }

        void ISqlContextExecution.Dispose()
        {
            if (connection == null)
                throw new Exception("CONNECTION IS NOT INITIALIZED");
            connection.Dispose();
        }

        async Task<ResponseBase<IEnumerable<object>>> ISqlContextExecution.Execute(SelectModel selectModel, string connectionString)
        {
            var execBase = new ExecuteInfoModel(selectModel.Joins.ToArray(), selectModel.Table.Type);
            using (var connection = Connection.CreateConnection(connectionString))
            {
                var sql = selectModel.ToSql();
                using (var multi = await connection.DbConnection.QueryMultipleAsync(sql, null, null, null, CommandType.Text))
                {
                    var count = 0;
                    var a = multi.IsConsumed;
                    var baseRes = multi.Read(execBase);
                    foreach (var item in selectModel.SubQueries)
                    {
                        var execUnion = new ExecuteInfoModel(item.Value.Joins.Where(x => x.Type != null).ToArray(), item.Value.Table.Type);
                        var children = multi.Read(execUnion).ToList();

                        baseRes.ForEach(x =>
                        x.GetType().GetProperty(item.Key).SetValue(
                            x,
                            children
                                .Where(c =>
                                        c.GetType().GetProperty(item.Value.Table.ForeignKey).GetValue(c).ToString() ==
                                        x.GetType().GetProperty(item.Value.Table.ParentPrimaryKey).GetValue(x).ToString()
                                ).CastToType(item.Value.Table.Type)
                        ));
                    }
                    //if (!multi.IsConsumed)
                    //    count = multi.ReadSingle<int>();
                    return new ResponseBase<IEnumerable<object>>()
                    {
                        Data = baseRes,
                        Count = count,
                        Status = connection.Messages.Any() ? ResponseStatus.Error : ResponseStatus.Success,
                        Messages = connection.Messages
                    };
                }
            }
        }
    }
}
