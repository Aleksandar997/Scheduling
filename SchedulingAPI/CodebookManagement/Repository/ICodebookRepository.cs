using CodebookManagement.Models;
using Entity.Base;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CodebookManagement.Repository
{
    public interface ICodebookRepository
    {
        Task<ResponseBase<IEnumerable<T>>> SelectAll<T>(Expression<Func<T, T>> func, CodebookPaging paging, List<JoinModel> joins, string cacheCode) where T : class;
        Task<ResponseBase<T>> SelectById<T>(Expression<Func<T, T>> func, List<JoinModel> joins, string cacheCode) where T : class;
        Task<ResponseBase<int>> Save<T>(Expression<Func<T, T>> func, T input, string cacheCode, int? id) where T : class;
    }
}
