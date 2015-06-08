using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using System.Web.Http.Cors;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ChronoZoom.Backend.Controllers
{
    [EnableCors(origins: "http://localhost:20000", headers: "*", methods: "*")]
    public class BatchController : ApiController
    {
        private readonly string _serverUploadFolder = Path.GetTempPath();
        private readonly IBatchService _service;

        public BatchController(IBatchService service)
        {
            _service = service;
        }

        /// <summary>
        /// Upload an batch
        /// </summary>
        /// <returns>The id of the timeline created by this batch</returns>
        [HttpPost]
        public async Task<IHttpActionResult> Post()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return BadRequest("No file uploaded!");
            }
        
            try
            {
                MultipartFormDataStreamProvider streamProvider = new MultipartFormDataStreamProvider(_serverUploadFolder);
                await Request.Content.ReadAsMultipartAsync(streamProvider);

                long timelineID = _service.ProcessFile(streamProvider.FileData[0].LocalFileName);

                return Ok(timelineID);
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            } 
        }
    }
}