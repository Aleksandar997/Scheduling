using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace SQLContext.Services.Interfaces
{
    public interface ISelectClauseService
    {
        SelectModel Select<T, TResult>(Expression<Func<T, TResult>> param, SelectModel selectModel) where T : class;
    }
}
