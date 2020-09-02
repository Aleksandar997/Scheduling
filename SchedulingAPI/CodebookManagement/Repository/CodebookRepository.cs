using CodebookManagement.Models;
using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Helpers;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CodebookManagement.Repository
{
    public class CodebookRepository : RepositoryBase, ICodebookRepository
    {
        public CodebookRepository(string connectionString) : base(connectionString) { }

        public async Task<ResponseBase<int>> Save<T>(Expression<Func<T, T>> func, T input, string cacheCode, int? id) where T : class =>
            await SqlContextFactory.Instance<T>(ConnectionString, cacheCode)
                        .Save(func, input, id)
                        .ExecuteSave();
                        

        public async Task<ResponseBase<IEnumerable<T>>> SelectAll<T>(Expression<Func<T, T>> func, CodebookPaging paging, List<JoinModel> joins, string cacheCode) where T : class =>
                    await SqlContextFactory.Instance<T>(ConnectionString, cacheCode)
                        .Select(func)
                        .Join(joins)
                        .OrderBy(paging)
                        .Execute();

        public async Task<ResponseBase<T>> SelectById<T>(Expression<Func<T, T>> func, List<JoinModel> joins, string cacheCode) where T : class =>
                    await SqlContextFactory.Instance<T>(ConnectionString, cacheCode)
                        .Select(func)
                        .Join(joins)
                        .ExecuteSingle();
    }
}
