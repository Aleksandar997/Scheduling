using Entity.Base;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SQLContext
{
    public abstract class RepositoryBase
    {
        public string ConnectionString { get; set; }

        public RepositoryBase(string connectionString)
        {
            ConnectionString = connectionString;
        }
        public ResponseBase<T> ReadData<T>(Func<ResponseBase<T>> func)
        {
            var sqlReaderModel = func.Target.GetType().GetField("read").GetValue(func.Target) as SqlReaderModel;
            if (sqlReaderModel.Read == null)
            {
                return ResponseBase<T>.Error(sqlReaderModel.SqlMessages);
            }
            var res = func();
            return res;
        }

        public ResponseBase<T> ReadData<T>(Func<T> func)
        {
            var sqlReaderModel = func.Target.GetType().GetField("read").GetValue(func.Target) as SqlReaderModel;
            if (sqlReaderModel.Read == null)
            {
                return ResponseBase<T>.Error(sqlReaderModel.SqlMessages);
            }
            var res = func();
            return ResponseBase<T>.Success(res, sqlReaderModel.SqlMessages);
        }
    }
}
