using System.Linq;

namespace Common.Extensions
{
    public static class StringExtensions
    {
        public static string FirstCharToUpper(this string value) => string.Join("", value.FirstOrDefault().ToString().ToUpper().Concat(value.Skip(1)));
        public static string SpliceLambda(this string str)
        {
            var splitArr = str.Split("=>");
            var input = splitArr.FirstOrDefault().Trim();
            if (splitArr.FirstOrDefault().StartsWith("("))
            {
                input = input.Split("(").LastOrDefault().Trim();
                return "(" + splitArr.LastOrDefault().Trim().Replace(input + ".", "");
            }
            return splitArr.LastOrDefault().Trim().Replace(input + '.', "");
        }
    }
}
