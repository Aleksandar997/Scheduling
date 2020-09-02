using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserManagement.Models;

namespace SchedulingAPI.Repository.Implementations
{
    public class ChartRepository : RepositoryBase, IChartRepository
    {
        public ChartRepository(string connectionString) : base(connectionString) { }

        //public async Task<ResponseBase<IEnumerable<ChartMetaData>>> SelectMetaData(int userId)
        //{
        //    using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
        //    {
        //        var read = await reader.ExecuteManual("[dbo].[Chart_SelectMetaData]", new { userId });
        //        return ReadData(() => read.Read.Read<ChartMetaData>());
        //    }
        //}

        //public async Task<ResponseBase<IEnumerable<BarChart>>> SelectMostSoldProductsAndServices(int userId)
        //{
        //    using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
        //    {
        //        var read = await reader.ExecuteManual("[dbo].[Chart_MostSoldProductsAndServices]", new { userId });
        //        return ReadData(() => read.Read.Read<BarChart>());
        //    }
        //}

        //public async Task<ResponseBase<IEnumerable<BarChart>>> SelectOrganizationUnitBySales(int userId)
        //{
        //    using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
        //    {
        //        var read = await reader.ExecuteManual("[dbo].[Chart_OrganizationUnitBySales]", new { userId });
        //        return ReadData(() => read.Read.Read<BarChart>());
        //    }
        //}

        public async Task<ResponseBase<IEnumerable<Chart>>> SelectChartData(int userId, string procedureName)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual(procedureName, new { userId });
                return ReadData(() => read.Read.Read<Chart>());
            }
        }

        public async Task<ResponseBase<IEnumerable<ChartGrouped>>> SelectChartGroupedData(int userId, string procedureName)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual(procedureName, new { userId });
                return ReadData(() => ChartGrouped.ToGroup(read.Read.Read<Chart>().ToList()));
            }
        }


        public async Task<ResponseBase<int>> SetDragPosition(ChartMetaData chartMetaData, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Chart_UpdatePosition]", new { 
                    chartMetaData.Name,
                    chartMetaData.X,
                    chartMetaData.Y,
                    userId
                });
                return ReadData(() => read.Read.ReadFirst<int>());
            }
        }
    }
}


