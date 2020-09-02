using Entity.Base;
using Localization.Interfaces;
using Localization.Models;
using SQLContext;
using SQLContext.Factories;
using SQLContext.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using SQLContext.Helpers;

namespace Localization.Implementation
{
    public class LocalizationRepository : RepositoryBase, ILocalizationRepository
    {
        public LocalizationRepository(string connectionString) : base(connectionString) 
        {
        }

        public async Task<ResponseBase<IEnumerable<Resource>>> SelectAll(ResourcePaging paging)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Translate_SelectAll]", new
                {
                    paging.SortBy,
                    paging.SortOrder,
                    paging.Skip,
                    paging.Take,
                    paging.Resource
                });
                return ReadData(() =>
                {
                    var resources = read.Read.Read<Resource>().ToList();
                    var translates = read.Read.Read<TranslateModel, Culture, TranslateModel>((translate, culture) =>
                    {
                        translate.Culture = culture;
                        return translate;
                    }, splitOn: "CultureId");

                    resources.ForEach(r => r.Translates = translates.Where(t => t.ResourceId == r.ResourceId));

                    var count = read.Read.ReadFirstOrDefault<int>();
                    return new ResponseBase<IEnumerable<Resource>>(resources, read.SqlMessages, count);
                });
            }
        }

        public async Task<ResponseBase<IEnumerable<Culture>>> SelectAllByCulture()
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Localization_Select]");
                return ReadData(() =>
                {
                    var cultures = read.Read.Read<Culture>().ToList();
                    var localization = read.Read.Read<TranslateModel, Resource, TranslateModel>((translate, resource) =>
                    {
                        translate.Resource = resource;
                        return translate;
                    }, splitOn: "ResourceId");
                    cultures.ForEach(c =>
                    {
                        c.LocalizationPair = localization.Where(l => l.CultureId == c.CultureId).ToDictionary(k => k.Resource.Name, v => v.Value);
                    });
                    return cultures.AsEnumerable();
                });
            }
        }
            //(await SqlContextFactory.Instance<Culture>(ConnectionString, "SelectAllByCulture")
            //        .Select(c => new
            //            {
            //                c.Name,
            //                c.Value,
            //                c.Flag,
            //                c.Active,
            //                Translate = SqlContextFactory.Instance<Culture, TranslateModel>(c => c.CultureId, t => t.CultureId, ConnectionString)
            //                                        .Select(l => new
            //                                            {
            //                                                l.Resource.Name,
            //                                                l.Value
            //                                            }
            //                                        )
            //                                        .Join<Resource>(JoinType.Inner, t => t.ResourceId, r => r.ResourceId)
            //            }
            //        ).Execute());

        public async Task<ResponseBase<Resource>> SelectById(int resourceId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Translate_SelectById]", new { resourceId });
                return ReadData(() =>
                {
                    var resource = read.Read.ReadFirst<Resource>();
                    resource.Translates = read.Read.Read<TranslateModel, Culture, TranslateModel>((translate, culture) =>
                    {
                        translate.Culture = culture;
                        return translate;
                    }, splitOn: "CultureId");

                    return resource;
                });
            }
        }

        public async Task<ResponseBase<Resource>> Save(Resource resource, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Translate_Save]", new 
                {
                    resource.ResourceId,
                    resource.Name,
                    Translates = ParameterHelper.ToUserDefinedTableType(resource.Translates.Select(x => new
                    {
                        x.TranslateId,
                        x.CultureId,
                        x.Value
                    }), "translate_list"),
                    userId
                });
                return ReadData(() =>
                {
                    var resource = read.Read.ReadFirst<Resource>();
                    resource.Translates = read.Read.Read<TranslateModel, Culture, TranslateModel>((translate, culture) =>
                    {
                        translate.Culture = culture;
                        return translate;
                    }, splitOn: "CultureId");

                    return resource;
                });
            }
        }

        public async Task<ResponseBase<IEnumerable<Culture>>> CultureSelectlist()
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Culture_Selectlist]");
                return ReadData(() => read.Read.Read<Culture>());
            }
        }
    }
}
