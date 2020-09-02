using Entity.Base;
using FileManagement.Models;
using SQLContext;
using SQLContext.Factories;
using System.Threading.Tasks;

namespace FileManagement.Repository
{
    public class FileRepository : RepositoryBase, IFileRepository
    {
        public FileRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<ResponseBase<FormFileBase>> UploadFile(FormFileBase formFileBase)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[File_Save]", new 
                { 
                    formFileBase.FileId,
                    formFileBase.FileName, 
                    formFileBase.Extension,
                    formFileBase.BlobData,
                    formFileBase.PreviousFileName,
                    formFileBase.PreviousFileExtension
                });
                return ReadData(() => 
                {
                    var res = read.Read.ReadFirst<int>();
                    formFileBase.FileId = res;
                    return new ResponseBase<FormFileBase>(formFileBase, read.SqlMessages);
                });
            }
        }
    }
}
