using Entity.Base;
using SchedulingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface IScheduleRepository
    {
        public Task<ResponseBase<Document>> SelectScheduleById(int id, int userId);
        public Task<ResponseBase<IEnumerable<Schedule>>> SelectSchedulesInMonth(SchedulePaging paging, int userId);
        public Task<ResponseBase<long>> SaveSchedule(Document document, int userId);
        public Task<ResponseBase<long>> DeleteSchedule(long scheduleId);
    }
}
