using System;
using System.Configuration;
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
        [HttpGet]
        public IHttpActionResult Get(string id)
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

        /// <summary>
        /// Create a new content item
        /// </summary>
        /// <param name="item">The content item</param>
        /// <returns>True if succesfully added</returns>
        [HttpPut]
        public IHttpActionResult Put(ContentItem item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Content item invalid");
            }

            try
            {
                _contentItemService.Add(item);
                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }
    }
}
