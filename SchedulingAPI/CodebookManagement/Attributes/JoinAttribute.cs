using SQLContext.Models;
using System;

namespace CodebookManagement.Attributes
{
    public class JoinAttribute : Attribute
    {
        public JoinType _joinType;
        public string _key { get; set; }
        public string _foreignKey { get; set; }
        public JoinAttribute(JoinType joinType, string key, string foreignKey)
        {
            _key = key;
            _foreignKey = foreignKey;
            _joinType = joinType;
        }
    }
}
