using Localization.Service;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.Adapters;

namespace FileManagement.Controller
{
    [Route("api/file")]
    public class FileController : ControllerAdapter
    {
        //private IFileService _userService { get; set; }
        public FileController(ILocalizationService localization) : base(localization)
        {
        }

        [HttpPost("{previousFileName}")]
        public async Task<IActionResult> UploadFile(string previousFileName = null) =>
            await AutoResponse(() => HttpContext.UploadFile(previousFileName));
    }
}
