using Configuration.Models;
using Configuration.Repository.Interfaces;
using Entity.Base;
using SQLContext;
using SQLContext.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.Repository.Implementations
{
    public class ThemeRepository : RepositoryBase, IThemeRepository
    {
        public ThemeRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<ResponseBase<IEnumerable<Theme>>> SelectAll(int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Theme_SelectAll]", new { userId });
                return ReadData(() =>
                {
                    var res = read.Read.Read<Theme, ThemeOptions, Theme>((theme, options) =>
                    {
                        theme.ThemeOptions = options;
                        return theme;
                    }, splitOn: "ThemeOptionsId");
                    return res;
                });
            }
        }

        public async Task<ResponseBase<Theme>> SetTheme(Theme theme, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Theme_SetTheme]", new { theme.ThemeId, userId });
                return ReadData(() =>
                {
                    var res = read.Read.Read<Theme, ThemeOptions, Theme>((theme, options) =>
                    {
                        theme.ThemeOptions = options;
                        return theme;
                    }, splitOn: "ThemeOptionsId");
                    return res.FirstOrDefault();
                });
            }
        }
    }
}
