using CodebookManagement.Models;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CodebookManagement.Service
{
    public interface ICodebookService
    {
        Task<ResponseBase<CodebookOutputModel<IEnumerable<T>>>> SelectAll<T>(Func<T, bool> Filter, CodebookPaging paging) where T : class;
        Task<ResponseBase<IEnumerable<T>>> SelectAllData<T>(Func<T, bool> Filter, CodebookPaging paging) where T : class;
        Task<ResponseBase<CodebookOutputModel<T>>> SelectById<T>(Func<T, bool> Filter) where T : class;
        Task<ResponseBase<int>> Save<T>(T request) where T : class, ICodebook;
        //Task<ResponseBase<T>> Save<T>(Func<T, object> saveModel, Func<T, bool> Filter) where T : class;
        //Task<ResponseBase<CodebookOutputModel<T>>> SelectById<T>(Func<IEnumerable<T>, T> Filter) where T : class;
    }
}
