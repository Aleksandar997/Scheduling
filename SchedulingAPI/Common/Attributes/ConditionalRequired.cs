using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Linq;
namespace Common.Attributes
{
    public class ConditionalRequired : ValidationAttribute
    {
        public string[] PropValue { get; set; }
        public ConditionalRequired(string propValue, string errorMessage)
        {
            PropValue = new string[] { propValue };
            ErrorMessage = errorMessage;
        }
        public ConditionalRequired(string[] propValue, string errorMessage)
        {
            PropValue = propValue;
            ErrorMessage = errorMessage;
        }
        //protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        //{
        //    foreach (var p in PropValue)
        //    {
        //        var vals = p.Split(";");
        //        var a = validationContext.ObjectType.GetProperty(vals.FirstOrDefault());
        //        var b = a.GetValue(validationContext.ObjectInstance);
        //    }
        //    return PropValue.Any(x =>
        //    {
        //        var vals = x.Split(";");
        //        if
        //        (
        //            vals.Length == 2 &&
        //            CheckEquality(validationContext.ObjectType.GetProperty(vals.FirstOrDefault()).GetValue(validationContext.ObjectInstance), vals.LastOrDefault()) &&
        //            value == null
        //        )
        //            return false;
        //        return true;
        //    }) ? ValidationResult.Success : new ValidationResult(ErrorMessage);
        //}

        protected override ValidationResult IsValid(object value, ValidationContext validationContext) =>
            PropValue.Any(x =>
            {
                var vals = x.Split(";");
                if
                (
                    vals.Length == 2 &&
                    CheckEquality(validationContext.ObjectType.GetProperty(vals.FirstOrDefault()).GetValue(validationContext.ObjectInstance), vals.LastOrDefault()) &&
                    value == null
                )
                    return false;
                return true;
            }) ? ValidationResult.Success : new ValidationResult(ErrorMessage);

        private bool CheckEquality(object value, string compareTo)
        {
            if (value.GetType() == typeof(bool))
            {
                return (bool)value == Convert.ToBoolean(compareTo);
            }
            return (string)value == compareTo;
        }
    }
}
