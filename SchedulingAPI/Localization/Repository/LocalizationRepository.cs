using Entity.Base;
using Localization.Interfaces;
using Localization.Models;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Localization.Implementation
{
    public class LocalizationRepository : RepositoryBase, ILocalizationRepository
    {
        public LocalizationRepository(string connectionString) : base(connectionString) 
        {
        }

        public async Task<ResponseBase<IEnumerable<Culture>>> SelectAllByCulture() =>
            (await SqlContextFactory.Instance<Culture>(ConnectionString, "SelectAllByCulture")
                    .Select(c => new
                        {
                            c.Name,
                            c.Value,
                            c.Flag,
                            c.Active,
                            Translate = SqlContextFactory.Instance<Culture, TranslateModel>(c => c.CultureId, t => t.CultureId, ConnectionString)
                                                    .Select(l => new
                                                        {
                                                            l.Resource.Name,
                                                            l.Value
                                                        }
                                                    )
                                                    .Join<Resource>(JoinType.Inner, t => t.ResourceId, r => r.ResourceId)
                        }
                    ).Execute());
        //return await ExecuteQuery(async () =>
        //{
        //    using (var connection = CreateConnection())
        //    {
        //        using (var multi = await connection.DbConnection.QueryMultipleAsync("[dbo].[Localization_SelectAll]", null, null, null, CommandType.StoredProcedure))
        //        {
        //            var localization = _cultureBuilder.BuildInformation(multi.Read<Culture>().ToList())
        //                                             .BuildLocalization(multi.Read<LocalizationEntity>().ToList())
        //                                             .Build();

        //            return new ResponseBase<IEnumerable<Culture>>()
        //            {
        //                Data = localization,
        //                Status = connection.Messages.Any() ? ResponseStatus.Error : ResponseStatus.Success
        //            };
        //        }
        //    }

        //});


        public async Task<ResponseBase<int>> SelectInUseCulture() => await Task.Run(() => new ResponseBase<int>());

        //return await ExecuteQuery(async () =>
        //{
        //    using (var connection = CreateConnection())
        //    {
        //        var cultureId = await connection.DbConnection.QueryFirstOrDefaultAsync<int>("[dbo].[Culture_SelectInUse]", null, null, null, CommandType.StoredProcedure);

        //        return new ResponseBase<int>()
        //        {
        //            Data = cultureId,
        //            Status = connection.Messages.Any() ? ResponseStatus.Error : ResponseStatus.Success
        //        };
        //    }

        //});

    }
}
