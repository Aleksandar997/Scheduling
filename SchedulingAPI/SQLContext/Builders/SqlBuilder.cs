using Common.Base;
using Entity.Base;
using SQLContext.Factories;
using SQLContext.Models;
using SQLContext.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SQLContext.Builders
{
    public class SqlBuilder<T> where T : class
    {
        private ISelectClauseService _selectClauseService = DependencyInjectionResolver.GetService<ISelectClauseService>();
        private IWhereClauseService _whereClauseService = DependencyInjectionResolver.GetService<IWhereClauseService>();
        private IOrderByClauseService _orderByClauseService = DependencyInjectionResolver.GetService<IOrderByClauseService>();
        private IJoinClauseService _joinClauseService = DependencyInjectionResolver.GetService<IJoinClauseService>();
        private ISqlContextExecution _execution = DependencyInjectionResolver.GetService<ISqlContextExecution>();

        private string _connectionString;
        private string _key;
        private SelectModel selectModel;
        private bool _isSelectImplemented = false;
        internal SqlBuilder(SelectModel cache, string connectionString, string key, bool autoJoin)
        {
            selectModel = cache ?? SelectModel.Instance(autoJoin);
            _connectionString = connectionString;
            _key = key;
            selectModel.Table = new TableModel(typeof(T));
        }

        internal SqlBuilder(string connectionString, bool autoJoin)
        {
            selectModel = SelectModel.Instance(autoJoin);
            _connectionString = connectionString;
            selectModel.Table = new TableModel(typeof(T));
        }

        internal SqlBuilder<T> JoinSubQuery<ParentTable>(Expression<Func<ParentTable, object>> baseTable, Expression<Func<T, object>> joinTable)
        {
            var parentColumn = ((baseTable.Body as UnaryExpression).Operand as MemberExpression).Member.Name;
            var childColumn = ((joinTable.Body as UnaryExpression).Operand as MemberExpression).Member.Name;
            selectModel.Table.SetKeys(parentColumn, childColumn);
            return this;
        }

        internal SqlBuilder(
                ISelectClauseService selectClauseService, 
                IWhereClauseService whereClauseService, 
                IOrderByClauseService orderByClauseService
            )
        {
            _selectClauseService = selectClauseService;
            _whereClauseService = whereClauseService;
            _orderByClauseService = orderByClauseService;
        }


        public SqlBuilder<T> Select<TResult>(Expression<Func<T, TResult>> param)
        {
            return ExecuteSqlOperation(() =>
            {
                _isSelectImplemented = true;
                if (selectModel.IsGenerated)
                    return this;
                selectModel.SetSelectClause(_selectClauseService.Select(param, selectModel));
                return this;
            });
        }
        public SqlBuilder<T> Where(Expression<Func<T, bool>> param)
        {
            return ExecuteSqlOperation(() =>
            {
                SelectImplementedCheck();
                selectModel.WhereClause = _whereClauseService.Where(param);
                return this;
            });
        }
        public SqlBuilder<T> OrderBy(BasePaging param)
        {
            return ExecuteSqlOperation(() =>
            {
                SelectImplementedCheck();
                selectModel.SetOrderByClause(_orderByClauseService.OrderBy(param));
                return this;
            });
        }
        public SqlBuilder<T> Join<JoinTable>(JoinType joinType, Expression<Func<T, object>> baseTable, Expression<Func<JoinTable, object>> joinTable)
        {
            return ExecuteSqlOperation(() =>
            {
                SelectImplementedCheck();
                if (selectModel.IsGenerated)
                    return this;
                selectModel.Joins.Add(_joinClauseService.Join(baseTable, joinTable, selectModel.Table, joinType));
                return this;
            });
        }
        public SqlBuilder<T> Join<ParentTable, JoinTable>(JoinType joinType, Expression<Func<ParentTable, object>> baseTable, Expression<Func<JoinTable, object>> joinTable)
        {
            return ExecuteSqlOperation(() =>
            {
                SelectImplementedCheck();
                if (selectModel.IsGenerated)
                    return this;
                selectModel.Joins.Add(_joinClauseService.Join(baseTable, joinTable, selectModel.Table, joinType));
                return this;
            });
        }
    
        public async Task<ResponseBase<IEnumerable<T>>> Execute()
        {
            SqlContextCache.TrySetValue(_key, selectModel.Generate());
            return await ExecuteQuery(async () => await _execution.Execute(selectModel, _connectionString));
        }

        public async Task<ResponseBase<T>> ExecuteSingle()
        {
            SqlContextCache.TrySetValue(_key, selectModel.Generate());
            return await ExecuteQuerySingle(async () => await _execution.Execute(selectModel, _connectionString));
        }

        private async Task<ResponseBase<T>> ExecuteQuerySingle(Func<Task<ResponseBase<IEnumerable<object>>>> function)
        {
            //try
            //{
                var res = await function.Invoke();
                return new ResponseBase<T>()
                {
                    Messages = res.Messages,
                    Data = res.Data.FirstOrDefault() as T,
                    Status = res.Status,
                    Count = res.Count
                };
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
        }

        private async Task<ResponseBase<IEnumerable<T>>> ExecuteQuery(Func<Task<ResponseBase<IEnumerable<object>>>> function)
        {
            //try
            //{
                var res = await function.Invoke();
                return new ResponseBase<IEnumerable<T>>()
                {
                    Messages = res.Messages,
                    Data = res.Data.Select(x => x as T).ToList(),
                    Status = res.Status,
                    Count = res.Count
                };
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
        }

        private void SelectImplementedCheck()
        {
            if (!_isSelectImplemented)
                throw new Exception("SELECT IS NOT IMPLEMENTED");
        }

        private SqlBuilder<T> ExecuteSqlOperation(Func<SqlBuilder<T>> func)
        {
            //try
            //{
                return func.Invoke();
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
        }
    }
}
