using Entity.Base;
using SchedulingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserManagement.Models;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface IChartRepository
    {
        //Task<ResponseBase<IEnumerable<BarChart>>> SelectMostSoldProductsAndServices(int userId);
        Task<ResponseBase<int>> SetDragPosition(ChartMetaData chartMetaData, int userId);
        //Task<ResponseBase<IEnumerable<BarChart>>> SelectOrganizationUnitBySales(int userId);
        Task<ResponseBase<IEnumerable<Chart>>> SelectChartData(int userId, string procedureName);
        Task<ResponseBase<IEnumerable<ChartGrouped>>> SelectChartGroupedData(int userId, string procedureName);
    }
}
