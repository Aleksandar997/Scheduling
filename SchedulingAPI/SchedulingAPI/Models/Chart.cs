using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Models
{
    public class Chart
    {
        public string Series { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public Chart() { }
        public Chart(string name, string value = "0") {
            Name = name;
            Value = value;
        }
    }

    public class ChartGrouped
    {
        public static IEnumerable<ChartGrouped> ToGroup(List<Chart> data)
        {
            var grouped = data.GroupBy(x => x.Series, e => new Chart(e.Name, e.Value));
            var res = new List<ChartGrouped>();
            res.AddRange(grouped.Select(g => new ChartGrouped(g.Key)));
            return Group(data, res); 
        }
        private static IEnumerable<ChartGrouped> Group(List<Chart> data, List<ChartGrouped> res = null)
        {
            foreach (var d in data)
            {
                res.Where(r => r.Name == d.Series).ToList().ForEach(x => x.BarCharts.Add(d));
            }
            return res;
        }
        public string Name { get; set; }
        public List<Chart> BarCharts { get; set; }
        public ChartGrouped(string name, List<Chart> barCharts = null)
        {
            Name = name;
            BarCharts = barCharts ?? new List<Chart>();
        }
    }
}
