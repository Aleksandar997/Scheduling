﻿using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace SQLContext.Services.Interfaces
{
    public interface ISaveService
    {
        SaveModel Save<T, TResult>(Expression<Func<T, TResult>> param, T input, int? id) where T : class;
    }
}
