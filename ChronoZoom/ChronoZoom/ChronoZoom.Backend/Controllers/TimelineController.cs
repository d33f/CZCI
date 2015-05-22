using System;
using System.Linq;
using System.Web.Http;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using System.Web.Http.Cors;

namespace ChronoZoom.Backend.Controllers
{
    [EnableCors(origins: "http://localhost:20000", headers: "*", methods: "*")]
    public class TimelineController : ApiController
    {
        private ITimelineService _timelineService;
        private IContentItemService _contentItemService;

        public TimelineController(ITimelineService timelineService, IContentItemService contentItemService)
        {
            _timelineService = timelineService;
            _contentItemService = contentItemService;
        }

        public IHttpActionResult Get()
        {
            try
            {
                var timeline = _timelineService.Get("12:0");
                var contentItems = _contentItemService.GetAllForTimeline(timeline.Id);
                timeline.ContentItems = contentItems.ToArray();
                return Ok(timeline);
            }
            catch (TimelineNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }

        /// <summary>
        /// Create a new timeline item
        /// </summary>
        /// <param name="timeline">The timeline item</param>
        /// <returns>True if succesfully added</returns>
        [HttpPut]
        public IHttpActionResult Put(Timeline timeline)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Timeline item invalid");
            }

            try
            {
                _timelineService.Add(timeline);
                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }
    }
}
