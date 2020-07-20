using Entity.Base;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using SQLContext;
using SQLContext.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchedulingAPI.Repository.Implementations
{
    public class CustomerRepository : RepositoryBase, ICustomerRepository
    {
        public CustomerRepository(string connectionString) : base(connectionString) { }
        public async Task<ResponseBase<Customer>> Save(Customer customer, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Customer_Save]",
                    new
                    {
                        customer.CustomerId,
                        customer.FirstName,
                        customer.LastName,
                        customer.PhoneNumber,
                        userId
                    }
                );
                return ReadData(() => read.Read.ReadFirst<Customer>());
            }
        }

        public async Task<ResponseBase<IEnumerable<Customer>>> SelectAll(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Customer_SelectAll]", new { userId });
                return ReadData(() => read.Read.Read<Customer>());
            }
        }

        public async Task<ResponseBase<Customer>> SelectById(int customerId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Customer_SelectById]", new { customerId });
                return ReadData(() => read.Read.ReadFirst<Customer>());
            }
        }
    }
}
