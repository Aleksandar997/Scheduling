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
    public class DocumentRepository : RepositoryBase, IDocumentRepository
    {
        public DocumentRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<ResponseBase<IEnumerable<Document>>> SelectAll(DocumentPaging documentPaging, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Document_SelectAll]",
                    new
                    {
                        documentPaging.SortBy,
                        documentPaging.SortOrder,
                        documentPaging.Skip,
                        documentPaging.Take,
                        documentPaging.DocumentType,
                        documentPaging.DocumentStatusId,
                        documentPaging.DocumentNumber,
                        OrganizationUnits = ParameterHelper.ToUserDefinedTableType(documentPaging.OrganizationUnits.Select(x => new { value = x }), "IntList"),
                        Customers = ParameterHelper.ToUserDefinedTableType(documentPaging.Customers.Select(x => new { value = x }), "IntList"),
                        PriceListTypes = ParameterHelper.ToUserDefinedTableType(documentPaging.PriceListTypes.Select(x => new { value = x }), "IntList"),
                        documentPaging.Date,
                        documentPaging.DateFrom,
                        documentPaging.DateTo,
                        userId
                    });
                var a = ReadData(() =>
                {
                    var res = read.Read.Read<Document, Schedule, PricelistType, DocumentStatus, Document>((document, schedule, priceListType, documentStatus) =>
                    {
                        document.PricelistType = priceListType;
                        document.DocumentStatus = documentStatus;
                        document.Schedule = schedule;
                        return document;
                    }, splitOn: "ScheduleId, PriceListTypeId, DocumentStatusId");
                    var count = read.Read.ReadFirstOrDefault<int>();
                    return new ResponseBase<IEnumerable<Document>>(res, read.SqlMessages, count);
                });
                return a;
            }
        }

        public async Task<ResponseBase<Document>> SelectById(long documentId, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Document_SelectById]", new { documentId, userId });
                var a = ReadData(() =>
                {
                    var res = read.Read.Read<Document, Schedule, Document>((document, schedule) =>
                    {
                        document.Schedule = schedule;
                        return document;
                    }, splitOn: "ScheduleId").FirstOrDefault();
                    res.OrganizationUnits = read.Read.Read<OrganizationUnit>().ToList();
                    res.DocumentDetails = read.Read.Read<DocumentDetail>().ToList();
                    return res;
                });
                return a;
            }
        }

        public async Task<ResponseBase<long>> Save(Document document, int userId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Document_Save]", new 
                { 
                    document.DocumentId,
                    DocumentType = document.DocumentType.CodePath,
                    document.DocumentStatusId,
                    document.ScheduleId,
                    document.Date,
                    document.IssuingPlace,
                    document.DateFrom,
                    document.DateTo,
                    document.Note,
                    document.Sum,
                    document.PricelistTypeId,
                    DocumentDetails = ParameterHelper.ToUserDefinedTableType(document.DocumentDetails.Select(x => new 
                    { 
                        x.DocumentDetailId,
                        x.EmployeeId,
                        x.ProductId,
                        x.Price,
                        x.Quantity,
                        x.Discount,
                        x.PriceWithDiscount
                    }), "document_detail_list"),
                    OrganizationUnits = ParameterHelper.ToUserDefinedTableType(document.OrganizationUnitIds.Select(x => new { value = x }), "IntList"),
                    userId
                });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }

        public async Task<ResponseBase<long>> Delete(long documentId)
        {
            using (var reader = SqlContextFactory.InstanceManual(ConnectionString))
            {
                var read = await reader.ExecuteManual("[dbo].[Document_Delete]", new { documentId });
                return ReadData(() => read.Read.ReadFirst<long>());
            }
        }
    }
}
