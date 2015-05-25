using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Data.MSSQL.Entities;

namespace ChronoZoom.Backend.Data.MSSQL.Factory
{
    public class TimelineFactory
    {
        public static Backend.Entities.Timeline Create(Timeline timeline)
        {
            //var id = timeline.ORID.RID.Substring(1, timeline.ORID.RID.Length-1);
            return new Backend.Entities.Timeline()
            {
                BeginDate = timeline.BeginDate,
                EndDate = timeline.EndDate,
                ContentItems = new Backend.Entities.ContentItem[0],
                Id = timeline.Id,
                Title = timeline.Title
            };
        }
    }
}