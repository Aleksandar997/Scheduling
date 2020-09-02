using System;
using System.Collections.Generic;
using System.Text;

namespace Configuration.Models
{
    public class Theme
    {
        public string Name { get; set; }
        public bool IsSystem { get; set; }
        public bool Active { get; set; }
        public ThemeOptions ThemeOptions { get; set; }
        public int ThemeId { get; set; }
    }

    public class ThemeOptions
    {
        public string BackgroundColor { get; set; }
        public string ButtonColor { get; set; }
        public string HeadingColor { get; set; }
        public string Value { get; set; }
    }
}
