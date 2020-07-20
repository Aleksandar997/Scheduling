using Entity.Base;
using SchedulingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface IDocumentRepository
    {
        Task<ResponseBase<IEnumerable<Document>>> SelectAll(DocumentPaging documentPaging, int userId);
        Task<ResponseBase<Document>> SelectById(long documentId, int userId);
        Task<ResponseBase<long>> Save(Document document, int userId);
        Task<ResponseBase<long>> Delete(long documentId);
    }
}
