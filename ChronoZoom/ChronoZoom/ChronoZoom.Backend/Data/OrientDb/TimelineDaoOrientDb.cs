using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.OrientDb.Factory;
using ChronoZoom.Backend.Exceptions;
using Orient.Client;

namespace ChronoZoom.Backend.Data.OrientDb
{
    public class TimelineDaoOrientDb : ITimelineDao
    {
        public Entities.Timeline Find(string id)
        {
            using (var db = new ODatabase(OrientDb.DATABASE))
            {
                try
                {
                    string queryWithparam = "select * from timeline where @rid=#" + id + ")";
                    Timeline timeline = db.Query<Timeline>(queryWithparam)[0];
                    return TimelineFactory.Create(timeline);
                }
                catch (Exception ex)
                {
                    throw new TimelineNotFoundException();
                }
            }
        }
    }
}