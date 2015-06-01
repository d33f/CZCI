using System;
using System.Web.Http;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using System.Web.Http.Cors;

namespace ChronoZoom.Backend.Controllers
{

    [EnableCors(origins: "http://localhost:20000", headers: "*", methods: "GET")]
    public class TimelineController : ApiController
    {
        private readonly ITimelineService _service;

        public TimelineController(ITimelineService service)
        {
            _service = service;
        }

        public IHttpActionResult Get(int id)
        {
            try
            {
                var timeline = _service.Get(id);
                return Ok(timeline);
            }
            catch (TimelineNotFoundException)
            {
                return NotFound();
            }
            catch (Exception exception)
            {
                return BadRequest("An error occured while retrieving a timeline: " + exception);
            }
        }

        public IHttpActionResult Get()
        {
            try
            {
                var timelines = _service.List();
                return Ok(timelines);
            }
            catch (TimelinesNotFoundException)
            {
                return NotFound();
            }
            catch (Exception exception)
            {
                return BadRequest("An error occured while retrieving a list of timelines: " + exception);
            }
        }
        
        /// <summary>
        /// Create a new timeline
        /// </summary>
        /// <param name="item">The timeline</param>
        /// <returns>The inserted timeline (with id)</returns>
        [HttpPut]
        public IHttpActionResult Put(Timeline timeline)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("timeline invalid");
            }
            if (timeline.Id == 0)
            {
                return BadRequest("No id specified");
            }

            try
            {
                _service.Update(timeline);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }

        /// <summary>
        /// Updates a timeline
        /// </summary>
        /// <param name="item">The timeline</param>
        /// <returns>Status OK if succesfully added</returns>
        [HttpPost]
        public IHttpActionResult Post(Timeline timeline)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("timeline invalid");
            }
            try
            {
                return Ok(_service.Add(timeline));
            }
            catch (Exception)
            {
                return BadRequest("An error occured");
            }
        }
    }
}
