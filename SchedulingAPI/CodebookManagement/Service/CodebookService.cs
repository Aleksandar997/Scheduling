using CodebookManagement.Attributes;
using CodebookManagement.Models;
using CodebookManagement.Repository;
using Common.Base;
using Entity.Base;
using ExpressionContext.Factory;
using ExpressionContext.Models;
using Microsoft.Extensions.Caching.Memory;
using SQLContext.Helpers;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace CodebookManagement.Service
{
    internal class CodebookCacheModel<T>
    {
        public Expression<Func<T, T>> Func { get; set; }
        public List<JoinModel> Joins { get; set; }
        public List<CodebookColumn> Columns { get; set; }
        public CodebookCacheModel(Expression<Func<T, T>> func, List<JoinModel> joins, List<CodebookColumn> columns)
        {
            Func = func;
            Joins = joins;
            Columns = columns;
        }

        public CodebookCacheModel(List<CodebookColumn> columns)
        {
            Columns = columns;
        }
    }
    internal class CodebookCache
    {
        internal static readonly IMemoryCache Cache = DependencyInjectionResolver.GetService<IMemoryCache>();
    }
    public class CodebookService : ICodebookService
    {
        ICodebookRepository _codebookRepositroy;
        
        public CodebookService(ICodebookRepository codebookRepositroy)
        {
            _codebookRepositroy = codebookRepositroy;
        }

        public async Task<ResponseBase<CodebookOutputModel<IEnumerable<T>>>> SelectAll<T>(Func<T, bool> Filter, CodebookPaging paging) where T : class
        {
            var res = await GetData<T>(paging);
            return ResponseBase<CodebookOutputModel<IEnumerable<T>>>.ReturnResponse(
                new CodebookOutputModel<IEnumerable<T>>(
                    res.Data.Columns,
                    res.Data.Data.Where(x => Filter(x))),
                res.Status,
                res.Messages
            );
        }

        public async Task<ResponseBase<IEnumerable<T>>> SelectAllData<T>(Func<T, bool> Filter, CodebookPaging paging) where T : class
        {
            var res = await GetData<T>(paging);
            return ResponseBase<IEnumerable<T>>.ReturnResponse(
                res.Data.Data.Where(x => Filter(x)),
                res.Status,
                res.Messages
            );
        }

        public async Task<ResponseBase<CodebookOutputModel<T>>> SelectById<T>(Func<T, bool> Filter) where T : class
        {
            var res = await GetData<T>();
            return ResponseBase<CodebookOutputModel<T>>.ReturnResponse(
                new CodebookOutputModel<T>(
                    res.Data.Columns,
                    res.Data.Data.FirstOrDefault(x => Filter(x))),
                res.Status,
                res.Messages
            );
        }

        public async Task<ResponseBase<int>> Save<T>(T request) where T : class, ICodebook
        {
            var type = typeof(T);
            var cacheName = "Cache_" + type.Name;
            CodebookCache.Cache.TryGetValue(cacheName, out CodebookCacheModel<T> cache);
            if (cache == null)
            {
                var joins = new List<JoinModel>();
                var columns = new List<CodebookColumn>();
                GetJoinAttributes(type, ref joins, ref columns);
                cache = new CodebookCacheModel<T>(columns);
            }
            cache.Columns = cache.Columns.Where(x => x.Editable).ToList();
            var expression = ExpressionBuilderFactory
                .Instance()
                .NewExpression(
                    NewExpressionModel.Instance(cache.Columns.Select(x => NewExpressionColumnModel.Instance(x.Name.Split(".").LastOrDefault(), x.Type)), type)
                )
                .LambdaExpression<T, T>() as Expression<Func<T, T>>;
            return await _codebookRepositroy.Save(expression, request, cacheName, request.Id);
        }

        private async Task<ResponseBase<CodebookOutputModel<IEnumerable<T>>>> GetData<T>(CodebookPaging paging = null) where T : class
        {
            var type = typeof(T);
            var cacheName = "Cache_" + type.Name;
            CodebookCache.Cache.TryGetValue(cacheName, out CodebookCacheModel<T> cache);
            if (cache == null)
            {
                var joins = new List<JoinModel>();
                var columns = new List<CodebookColumn>();
                GetJoinAttributes(type, ref joins, ref columns);
                var expression = ExpressionBuilderFactory
                    .Instance()
                    .NewExpression(
                        NewExpressionModel.Instance(columns.Select(x => NewExpressionColumnModel.Instance(x.Name.Split(".").LastOrDefault(), x.Type)), type)
                    )
                    .LambdaExpression();
                cache = new CodebookCacheModel<T>(expression as Expression<Func<T, T>>, joins, columns);
            }
            var res = await _codebookRepositroy.SelectAll(cache.Func, paging, cache.Joins, cacheName);
            return ResponseBase<CodebookOutputModel<IEnumerable<T>>>.ReturnResponse(new CodebookOutputModel<IEnumerable<T>>(cache.Columns, res.Data), res.Status, res.Messages);
        }

        private void GetJoinAttributes(Type type, ref List<JoinModel> joinAttributes, ref List<CodebookColumn> codebookColumns, string parentType = null)
        {
            foreach (var t in type.GetProperties())
            {
                var joinAttr = t.GetCustomAttributes(typeof(JoinAttribute)).FirstOrDefault() as JoinAttribute;
                var columnAttr = t.GetCustomAttributes(typeof(ColumnAttribute)).FirstOrDefault() as ColumnAttribute;
                if (columnAttr != null)
                {
                    codebookColumns.Add(new CodebookColumn(parentType + t.Name, columnAttr._controlType, columnAttr._display, columnAttr._editable, type));
                }

                if (joinAttr != null)
                {
                    joinAttributes.Add(JoinModelFactory.Initialize(joinAttr._joinType, type.Name, t.PropertyType.Name, joinAttr._key, joinAttr._foreignKey, t.PropertyType));
                    GetJoinAttributes(t.PropertyType, ref joinAttributes, ref codebookColumns, parentType + t.Name + ".");
                }
            }
        }
    }
}

