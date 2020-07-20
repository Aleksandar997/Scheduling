using System;
using System.Collections.Generic;
using System.Text;

namespace FileManagement
{
    public class FileInfo
    {
        public string CurrentName { get; set; }
        public string PastName { get; set; }

        public FileInfo(string _CurrentName, string _PastName)
        {
            CurrentName = _CurrentName;
            PastName = _PastName;
        }
    }
}
