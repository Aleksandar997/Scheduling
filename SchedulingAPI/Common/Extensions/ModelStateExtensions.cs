using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq;
using System.Reflection;
using Web.Attributes;

namespace Web.Extensions
{
    public static class ModelStateExtensions
    {
        public static void RemoveChildValidation<T>(this ModelStateDictionary modelState, T model)
        {
            if (model == null) return;
            var objectClassName = model.GetType().Name;
            var a = model.GetType().GetMembers().Where(p => p.IsDefined(typeof(ChildValidation)));
            var b = model.GetType().GetCustomAttributes(typeof(ChildValidation));
            foreach (var prop in model.GetType().GetMembers().Where(p => p.IsDefined(typeof(ChildValidation))))
            {
                var requiredFields = prop.GetCustomAttribute<ChildValidation>().RequiredProperties;
                modelState
                    .Where(e => e.Key.StartsWith(objectClassName + "." + prop.Name) || e.Key.StartsWith(prop.Name))
                    .ToList()
                    .ForEach(error => 
                    {
                        if (requiredFields == null || !requiredFields.Contains(prop.Name)) modelState.Remove(error.Key);
                    });
            }
        }
    }
}
