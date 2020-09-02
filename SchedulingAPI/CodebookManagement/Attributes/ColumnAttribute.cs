using System;
using System.Collections.Generic;
using System.Text;

namespace CodebookManagement.Attributes
{
    public class ColumnAttribute : Attribute
    {
        public ControlType _controlType;
        public bool _display = true;
        public bool _editable { get; set; }
        public ColumnAttribute(ControlType controlType, bool editable)
        {
            _controlType = controlType;
            _editable = editable;
        }
        public ColumnAttribute(bool display = true)
        {
            _display = display;
        }
    }

    public enum ControlType { Input, NumberInput, DateTimePicker, SelectList, Toggle, File };
}
