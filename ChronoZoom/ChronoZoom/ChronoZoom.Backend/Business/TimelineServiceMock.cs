using ChronoZoom.Backend.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Business
{
    public class TimelineServiceMock : ITimelineService
    {
        public Entities.Timeline Get(string id)
        {
            return new Entities.Timeline()
            {
                Id = "1",
                BeginDate = 1900,
                EndDate = 1950,
                Title = "20th Century",
                ContentItems = new Entities.ContentItem[0]
            };
        }

        public void Add(Entities.Timeline timeline)
        {
            throw new NotImplementedException();
        }
    }
}