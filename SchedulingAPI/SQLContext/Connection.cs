using Entity.Base;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace SQLContext
{
    public class Connection : IDisposable
    {
        //private readonly SqlConnection _sqlConnection;
        private readonly List<string> _message;
        internal Connection(string connectionString, string ssp)
        {
            _message = new List<string>();
            DbConnection = new SqlConnection(connectionString);
            DbConnection.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
            {
                _message.AddRange(e.Message.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries).ToList());
            };
        }

        internal SqlConnection DbConnection { get; private set; }

        internal List<ResponseMessage> Messages => _message.Select(p => new ResponseMessage { Code = p }).ToList();

        public void Dispose()
        {
            DbConnection.Dispose();
        }

        internal static Connection CreateConnection(string connectionString, string ssp = null) => new Connection(connectionString, ssp);
    }
}
