using Entity.Base;
using SchedulingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Interfaces
{
    public interface ICustomerRepository
    {
        Task<ResponseBase<Customer>> Save(Customer customer, int userId);
        Task<ResponseBase<IEnumerable<Customer>>> SelectAll(int userId);
        Task<ResponseBase<Customer>> SelectById(int customerId);
    }
}
