using Common.Base;
using Entity.Base;
using FileManagement.Models;
using FileManagement.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FileManagement.Service
{
    public class FileService
    {
        private static readonly IFileRepository fileRepository = DependencyInjectionResolver.GetService<IFileRepository>();
        private static readonly IHttpContextAccessor HttpContextAccessor = DependencyInjectionResolver.GetService<IHttpContextAccessor>();
        private static readonly IWebHostEnvironment env = DependencyInjectionResolver.GetService<IWebHostEnvironment>();
        private static readonly List<string> AlowImageExtensions = (".jpg,.jpeg,.png,.bmp").Split(',').ToList();
        private static readonly string Host = HttpContextAccessor.HttpContext.Request.Scheme + "://" + HttpContextAccessor.HttpContext.Request.Host + HttpContextAccessor.HttpContext.Request.PathBase + "/";
        private static readonly string ServerPath = env.ContentRootPath + "/";
        private const string TempFolderPath = UploadFolderName + "temp/";
        private const string UploadFolderName = "upload/";
        public static ResponseBase<List<string>> DeleteFile(List<string> fileNames)
        {
            foreach (var name in fileNames)
            {
                if (File.Exists(GetFileFullPath(name)))
                {
                    try
                    {
                        File.Delete(GetFileFullPath(name));
                    }
                    catch (Exception)
                    {
                        return ResponseBase<List<string>>.Error("image_delete_error");
                    }
                }
            }
            return ResponseBase<List<string>>.ReturnResponse(fileNames, ResponseStatus.Success);
        }
        public static async Task<ResponseBase<FormFileBase>> UploadFile(FormFileBase formFileBase)
        {
            DeleteFile(new List<string>() { formFileBase.FullPreviousFileName });
            formFileBase.FileName = Guid.NewGuid().ToString();
            formFileBase.Extension = Path.GetExtension(formFileBase.FormFile.FileName);
            var fullPath = GetFileFullPath(formFileBase.FullFileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await formFileBase.FormFile.CopyToAsync(stream);
            }
            if (!CheckExtension(formFileBase.FullFileName))
                return ResponseBase<FormFileBase>.Error("file_extension_not_allowed");

            var res = await fileRepository.UploadFile(formFileBase);
            res.Data.FormFile = null;
            return res;
        }
        private static string GetFileFullPath(string fileName)
        {
            return ServerPath + TempFolderPath + fileName;
        }
        public static string GetFileHostPath(string fileName)
        {
            return Host + TempFolderPath + fileName;
        }
        private static bool CheckExtension(string fileName)
        {
            return AlowImageExtensions.Contains(Path.GetExtension(fileName)) ? true : false;
        }
    }
}



