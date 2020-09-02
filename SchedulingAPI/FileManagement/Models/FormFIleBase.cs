using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FileManagement.Models
{
    public class FormFileBase
    {
        public IFormFile FormFile { get; set; }
        public int FileId { get; set; }
        public byte[] BlobData { get; set; }
        public string FileName { get; set; }
        public string Extension { get; set; }
        public string FullFileName => FileName + Extension;
        public string PreviousFileExtension { get; set; }
        public string PreviousFileName { get; set; }

        public string FullPreviousFileName
        {
            get => PreviousFileName + PreviousFileExtension;
            set {
                var val = value.Split(".");
                if (val.Length == 2)
                {
                    PreviousFileName = val.FirstOrDefault();
                    PreviousFileExtension = "." + val.LastOrDefault();
                }
            }
        }
        public FormFileBase(IFormFile formFile, byte[] blobData, string fullPreviousFileName)
        {
            FormFile = formFile;
            BlobData = blobData;
            FullPreviousFileName = fullPreviousFileName;
        }
    }
}
