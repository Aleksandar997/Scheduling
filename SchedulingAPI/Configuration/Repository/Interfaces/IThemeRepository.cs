using Configuration.Models;
using Entity.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.Repository.Interfaces
{
    public interface IThemeRepository
    {
        Task<ResponseBase<IEnumerable<Theme>>> SelectAll(int userId);
        Task<ResponseBase<Theme>> SetTheme(Theme theme, int UserId);
    }
}
