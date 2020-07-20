using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Helpers;
using SQLContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Implementations
{
    public class ScheduleRepository : RepositoryBase, IScheduleRepository
    {
        public ScheduleRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<ResponseBase<long>> DeleteSchedule(long scheduleId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Schedule_DeleteById]", new { scheduleId });
                return ReadData(() => read.Read.ReadFirstOrDefault<long>());
            }
        }
        public async Task<ResponseBase<long>> SaveSchedule(Document document, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Schedule_Save]",
                    new
                    {
                        document.ScheduleId,
                        document.Schedule.CustomerId,
                        document.Schedule.PhoneNumber,
                        document.Schedule.Date,
                        document.Note,
                        document.Sum,
                        document.OrganizationUnitId,
                        userId,
                        Details = ParameterHelper.ToUserDefinedTableType(document.DocumentDetails.Select(x => new
                        {
                            x.DocumentDetailId,
                            x.EmployeeId,
                            x.ProductId,
                            x.Price,
                            x.Quantity,
                            x.Discount,
                            x.PriceWithDiscount
                        }), "document_detail_list"),
                    });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }

        public async Task<ResponseBase<Document>> SelectScheduleById(int id, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Schedule_SelectById]", new { ScheduleId = id, UserId = userId });

                return ReadData(() =>
                {
                    var res = read.Read.Read<Document, Schedule, Document>((document, schedule) =>
                    {
                        document.ScheduleId = schedule.ScheduleId;
                        document.Schedule = schedule;
                        return document;
                    }, splitOn: "ScheduleId").FirstOrDefault();
                    res.DocumentDetails = read.Read.Read<DocumentDetail>();
                    return res;
                });
            }
        }


        public async Task<ResponseBase<IEnumerable<Schedule>>> SelectSchedulesInMonth(SchedulePaging paging, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Schedule_SelectAllInMonth]",
                    new {
                        paging.DateFrom, 
                        paging.DateTo, 
                        Employees = ParameterHelper.ToUserDefinedTableType(paging.Employees.Select(x => new { value = x }), "IntList"),
                        OrganizationUnits = ParameterHelper.ToUserDefinedTableType(paging.OrganizationUnits.Select(x => new { value = x }), "IntList"),
                        userId
                    }
                );

                var a = ReadData(() =>
                {
                    return read.Read.Read<Schedule, Customer, Schedule>((schedule, customer) =>
                    {
                        schedule.Customer = customer;
                        return schedule;
                    }, splitOn: "CustomerId");
                });
                return a;
            }
        }
    }
}
