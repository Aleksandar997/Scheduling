using System;


namespace Web.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ChildValidation : Attribute
    {
        public string[] RequiredProperties { get; set; }
    }
}
