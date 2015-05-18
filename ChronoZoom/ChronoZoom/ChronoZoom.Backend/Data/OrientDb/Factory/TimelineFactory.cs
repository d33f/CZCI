using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.OrientDb.Factory
{
    public class TimelineFactory
    {
        public static Entities.Timeline Create(Timeline timeline)
        {
            var id = timeline.ORID.RID.Substring(1, timeline.ORID.RID.Length-1);
            return new Entities.Timeline()
            {
                BeginDate = timeline.BeginDate,
                EndDate = timeline.EndDate,
                ContentItems = new Entities.ContentItem[0],
                Id = id,
                Title = timeline.Title
            };
        }
    }
}