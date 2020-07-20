using Common.Extensions;
using Localization.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulingAPI.Models;
using SchedulingAPI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Adapters;

namespace SchedulingAPI.Controllers
{
    [Route("api/document")]
    public class DocumentController : ControllerAdapter
    {
        IDocumentRepository _documentRepository;
        public DocumentController(ILocalizationService localization, IDocumentRepository documentRepository) : base(localization)
        {
            _documentRepository = documentRepository;
        }

        [Authorize]
        [HttpGet("selectAllByType")]
        public async Task<IActionResult> SelectAllByType() =>
            await AutoResponse(() => _documentRepository.SelectAll(HttpContext.Request.Query.ToObject<DocumentPaging>(), UserId));

        [Authorize]
        [HttpGet("selectById/{id}")]
        public async Task<IActionResult> SelectById(long id) =>
             await AutoResponse(() => _documentRepository.SelectById(id, UserId));

        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] Document document) =>
            await AutoResponse(() => _documentRepository.Save(document, UserId));

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(long id) =>
            await AutoResponse(() => _documentRepository.Delete(id));
    }
}
