using System;
using System.Web.Http;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using System.Web.Http.Cors;

namespace ChronoZoom.Backend.Controllers
{
    [EnableCors(origins: "http://localhost:20000", headers: "*", methods: "*")]
    public class ContentItemController : ApiController
    {
        private IContentItemService _contentItemService;

        public ContentItemController(IContentItemService contentItemService)
        {
            _contentItemService = contentItemService;
        }

        /// <summary>
        /// Get ContentItems by parentId
        /// </summary>
        /// <param name="id">parentId</param>
        /// <returns>List with contentItems by the given parent id</returns>
        public IHttpActionResult Get(int id)
        {
            try
            {
                var contentItems = _contentItemService.GetAll(id);
                return Ok(contentItems);
            }
            catch (ContentItemNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }
    }
}
