using Entity.Base;
using FileManagement.Models;
using System.Threading.Tasks;

namespace FileManagement.Repository
{
    public interface IFileRepository
    {
        Task<ResponseBase<FormFileBase>> UploadFile(FormFileBase formFileBase);
    }
}
