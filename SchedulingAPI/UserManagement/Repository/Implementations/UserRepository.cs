using CompanyManagement.Models;
using Configuration.Models;
using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using System.Linq;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Repository.Interfaces;

namespace UserManagement.Repository.Implementations
{
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(string connectionString) : base(connectionString) { }

        public async Task<ResponseBase<User>> LoginUser(string username, string password, int cultureId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[sysUser_Login]", new { username, password, cultureId });
                var res = ReadData(() => {
                    var user = read.Read.ReadFirst<User>();
                    user.Roles = read.Read.Read<Role>().ToList();
                    user.Menus = read.Read.Read<Menu>().ToList();
                    user.Permissions = read.Read.Read<Permission>().ToList();
                    return user;
                });
                if (res.Messages.Find(x => x.Code == "password_expired") != null)
                {
                    return ResponseBase<User>.ReturnResponse(res.Data, ResponseStatus.PasswordExpired, res.Messages);
                }
                return res;
            }
        }

        public async Task<ResponseBase<User>> SelectById(long userId = 0)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[sysUser_SelectById]", new { userId });
                return ReadData(() =>
                {
                    var user = read.Read.Read<User, Company, User>((user, company) =>
                    {
                        company.CompanyId = null;
                        user.Company = company;
                        return user;
                    }, splitOn: "CompanyId").FirstOrDefault();
                    user.Roles = read.Read.Read<Role>().ToList();
                    user.Menus = read.Read.Read<Menu>().ToList();
                    user.Permissions = read.Read.Read<Permission>().ToList();
                    user.ChartMetaData = read.Read.Read<ChartMetaData>().ToList();
                    user.Theme = read.Read.Read<Theme, ThemeOptions, Theme>((theme, options) =>
                    {
                        theme.ThemeOptions = options;
                        return theme;
                    }, splitOn: "ThemeOptionsId").FirstOrDefault();
                    return new ResponseBase<User>(user, read.SqlMessages);
                });

            }
        }

        public async Task<ResponseBase<long>> ForgottenPassword(UserCredentials userCredentials)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[sysUser_ForgottenPassword]", new
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
                var read = await reader.ExecuteManual("[dbo].[sysUser_ChangePassword]", new
                {
                    passwordModel.UserName,
                    passwordModel.Password,
                    passwordModel.NewPassword,
                    passwordModel.IsAdmin
                });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }
    }
}
