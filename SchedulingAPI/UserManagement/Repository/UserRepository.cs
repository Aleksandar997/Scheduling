using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using System.Linq;
using System.Threading.Tasks;
using UserManagement.Models;

namespace UserManagement.Repository
{
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(string connectionString) : base(connectionString) { }

        public async Task<ResponseBase<User>> LoginUser(string username, string password, int cultureId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var res = await reader.ExecuteManual("[dbo].[User_Login]", new { username, password, cultureId });
                var user = res.Read.ReadFirst<User>();
                user.Roles = res.Read.Read<Role>().ToList();
                user.Menus = res.Read.Read<Menu>().ToList();
                user.Permissions = res.Read.Read<Permission>().ToList();
                return new ResponseBase<User>(user, res.SqlMessages);
            }
        }

        public async Task<ResponseBase<User>> SelectById(long userId = 0)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var res = await reader.ExecuteManual("[dbo].[User_SelectById]", new { userId });
                var user = res.Read.Read<User, Company, User>((user, company) =>
                {
                    user.Company = company;
                    return user;
                }, splitOn: "CompanyId").FirstOrDefault();
                user.Roles = res.Read.Read<Role>().ToList();
                user.Menus = res.Read.Read<Menu>().ToList();
                user.Permissions = res.Read.Read<Permission>().ToList();
                return new ResponseBase<User>(user, res.SqlMessages);
            }
        }

        public async Task<ResponseBase<long>> ForgottenPassword(UserCredentials userCredentials)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[User_ForgottenPassword]", new
                {
                    userCredentials.UserName,
                    userCredentials.Email,
                    userCredentials.NewPassword
                });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }

        public async Task<ResponseBase<long>> ChangePassword(PasswordModel passwordModel)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[User_ChangePassword]", new
                {
                    passwordModel.UserName,
                    passwordModel.Password,
                    passwordModel.NewPassword
                });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }
    }
}
