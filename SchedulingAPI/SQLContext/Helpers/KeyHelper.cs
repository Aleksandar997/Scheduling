using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SQLContext.Helpers
{
    public static class KeyHelper
    {
        public static string GetPrimaryKey(Type type)
        {
            var res = type.GetProperties().Where(x => x.CustomAttributes.Any(c => c.AttributeType == typeof(PrimaryKeyAttribute))).FirstOrDefault();
            if (res == null)
                throw new Exception(string.Format("CLASS {0} DOESN'T HAVE PRIMARY KEY", type.Name));
            return res.Name;
        }

        public static string GetForeignKey(Type type, string foreignTable)
        {
            var res = type.GetProperties()
            .Where(x =>
                x.CustomAttributes
                    .Any(c => c.AttributeType == typeof(ForeignKeyAttribute) && c.ConstructorArguments.Any(d => (string)d.Value == foreignTable))
            ).FirstOrDefault();
            if (res == null)
                throw new Exception(string.Format("CLASS {0} DOESN'T HAVE FOREIGN KEY", type.Name));
            return res.Name;
        }
    }
}
