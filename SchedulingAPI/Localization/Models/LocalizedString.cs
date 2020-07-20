namespace Localization.Models
{
    public class LocalizedString
    {
        public int CultureId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public LocalizedString(int cultureId, string name, string value)
        {
            CultureId = cultureId;
            Name = name;
            Value = value;
        }
    }
}
