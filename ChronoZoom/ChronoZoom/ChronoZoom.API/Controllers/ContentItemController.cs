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
    public class ContentItemController : ApiController
    {
        private IContentItemService service;

        public ContentItemController(IContentItemService service)
        {
            this.service = service;
        }

        // GET api/ContentItem/{id}
        public IEnumerable<ContentItem> Get(int id)
        {
            return service.FindContentItems(id);
        }
    }
}
