using System;
using System.Collections.Generic;
using System.Text;

namespace Entity
{
    public class AppSettings
    {
        private static AppSettings instance;

        private AppSettings() { }

        public static AppSettings Instance => instance = instance ?? new AppSettings();

        public string Config { get; set; }
        public Database Database { get; set; }
        public SmtpClientConfig SmtpClient { get; set; }
        public Security Security { get; set; }
    }

    public class Database
    {
        public string ConnectionString { get; set; }
    }

    public class SmtpClientConfig
    {
        public string FromEmail { get; set; }
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string ReceiverEmail { get; set; }
        public int? Port { get; set; }
        public bool EnableSsl { get; set; }
    }
    public class Security
    {
        public string SecurityKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }
}
