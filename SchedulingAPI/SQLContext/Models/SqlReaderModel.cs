using Dapper;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace SQLContext.Models
{
    public class SqlReaderModel : SqlReaderBaseModel
    {
        public SqlMapper.GridReader Read { get; set; }

        public SqlReaderModel(SqlMapper.GridReader read, List<ResponseMessage> sqlMessages) : base(sqlMessages)
        {
            Read = read;
        }

        public static SqlReaderModel Error(string message)
        {
            return new SqlReaderModel(null, new List<ResponseMessage>() { new ResponseMessage(message) });
        }

        public void Dispose()
        {
            Read.Dispose();
        }
    }

    public abstract class SqlReaderBaseModel
    {
        public List<ResponseMessage> SqlMessages { get; set; }
        public SqlReaderBaseModel(List<ResponseMessage> sqlMessages)
        {
            SqlMessages = sqlMessages;
        }
    }
}
