using ChronoZoom.Backend.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Business
{
    public class TimelineServiceMock : ITimelineService
    {
        public Entities.Timeline Get(int id)
        {
            return new Entities.Timeline()
            {
                Id = 1,
                BeginDate = 1900,
                EndDate = 1950,
                Title = "20th Century",
                ContentItems = new Entities.ContentItem[]
                { 
                    new Entities.ContentItem()
                    {
                        Id = 1,
                        BeginDate = 1914M,
                        EndDate = 1918M,
                        HasChildren = true,
                        Title = "World War I",
                        Source = "http://upload.wikimedia.org/wikipedia/commons/2/20/WWImontage.jpg",
                        Depth = 1,
                        ParentId = -1
                    },
                    new Entities.ContentItem()
                    {
                        Id = 2,
                        BeginDate = 1940M,
                        EndDate = 1945M,
                        HasChildren = true,
                        Title = "World War II",
                        Source = "http://upload.wikimedia.org/wikipedia/commons/5/54/Infobox_collage_for_WWII.PNG",
                        Depth = 1,
                        ParentId = -1
                    }
                }
            };
        }
    }
}