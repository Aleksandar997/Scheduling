using Common.Base;
using Entity.Base;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace FileManagement.Service
{
    public class FileService
    {
        private static readonly IHttpContextAccessor HttpContextAccessor = DependencyInjectionResolver.GetService<IHttpContextAccessor>();
        private static readonly IHostingEnvironment env = DependencyInjectionResolver.GetService<IHostingEnvironment>();
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
                        return new ResponseBase<List<string>>();
                        //return ResponseBase<List<string>>.ReturnResponse(new List<string>() { name }, ResponseStatus.Error, new ResponseMessage("image_delete_error").SingleToList());
                    }
                }
            }
            return ResponseBase<List<string>>.ReturnResponse(fileNames, ResponseStatus.Success);
        }
        public static ResponseBase<FileInfo> UploadFile(IFormFile file)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = GetFileFullPath(fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            if (!CheckExtension(fileName))
                return new ResponseBase<FileInfo>();
            //return ResponseBase<FileInfo>.ReturnResponse(new FileInfo(fileName, file.FileName), ResponseStatus.Error, new ResponseMessage("file_extension_not_allowed").SingleToList());

            return ResponseBase<FileInfo>.ReturnResponse(new FileInfo(fileName, file.FileName), ResponseStatus.Success);
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

//var uploadFileInfo = new List<UploadFileInfo>();

//            foreach (var file in HttpContext.Request.Form.Files)
//            {
//                using (var ms = new MemoryStream())
//                {
//                    await file.CopyToAsync(ms);
//var img = new FormFile(ms, 0, ms.Length, file.Name, file.FileName);

//var res = FileService.UploadFile(img);
//uploadFileInfo.Add(res.Data);
//                    if (res.Status == ResponseStatus.Error)
//                        return Ok(ResponseBase<List<UploadFileInfo>>.ReturnResponse(uploadFileInfo, ResponseStatus.Error, res.Messages));
//                }
//            }
