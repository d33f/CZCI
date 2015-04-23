using ChronoZoom.API.Entities;
using ChronoZoom.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ChronoZoom.API.Controllers
{
    [EnableCors(origins: "http://localhost:20000", headers: "*", methods: "*")]
    public class TimelineController : ApiController
    {
        private ITimelineService service;

        public TimelineController(ITimelineService service)
        {
            this.service = service;
        }

        // GET api/Timeline
        public Timeline Get()
        {
            return service.FindTimeline(1);
        }

        // GET api/Timeline/5
        public Timeline Get(int id)
        {
            return service.FindTimeline(id);
        }
    }
}
