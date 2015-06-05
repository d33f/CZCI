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
        private readonly IContentItemService _service;

        public ContentItemController(IContentItemService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get ContentItems by parentId
        /// </summary>
        /// <param name="id">parentId</param>
        /// <returns>List with contentItems by the given parent id</returns>
        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            try
            {
                ContentItem contentItem = _service.Find(id, 1);
                return Ok(contentItem);
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }

        /// <summary>
        /// Updates a content item
        /// </summary>
        /// <param name="contentItem">The content item</param>
        /// <returns>Status OK if succesfully added</returns>
        [HttpPut]
        public IHttpActionResult Put(ContentItem contentItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Content item invalid");
            }
            if (contentItem.Id == 0)
            {
                return BadRequest("No id specified");
            }

            try
            {
                _service.Update(contentItem);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }

        /// <summary>
        /// Create a new content item
        /// </summary>
        /// <param name="contentItem">The content item</param>
        /// <returns>The inserted content item (with id)</returns>
        [HttpPost]
        public IHttpActionResult Post(ContentItem contentItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Content item invalid");
            }
            try
            {
                return Ok(_service.Add(contentItem));
            }
            catch (Exception e)
            {
                return BadRequest("An error occured");
            } 
        }
    }
}
