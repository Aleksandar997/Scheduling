using Entity;
using Entity.Base;
using FileManagement.Models;
using FileManagement.Repository;
using FileManagement.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using System.Threading.Tasks;

namespace FileManagement
{
    public static class FileExtensions
    {
        public async static Task<ResponseBase<FormFileBase>> UploadFile(this HttpContext context, string previousFileName)
        {
            var output = new ResponseBase<FormFileBase>();
            foreach (var file in context.Request.Form.Files)
            {
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    var formFile = new FormFile(ms, 0, ms.Length, file.Name, file.FileName);
                    var fileBytes = ms.ToArray();
                    var res = await FileService.UploadFile(new FormFileBase(formFile, fileBytes, previousFileName));
                    output = res;
                }
            }
            return output;
        }

        private static string connectionString => AppSettings.Instance.Database.ConnectionString;
        public static void AddFileManagementDependencies(this IServiceCollection services)
        {
            services.AddSingleton<IFileRepository, FileRepository>(x => new FileRepository(connectionString));
        }
    }

    //var uploadFileInfo = new List<UploadFileInfo>();
}
