using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.OrientDb.Factory;
using ChronoZoom.Backend.Exceptions;
using Orient.Client;

namespace ChronoZoom.Backend.Data.OrientDb
{
    public class TimelineDaoOrientDb : ITimelineDao
    {
        public Entities.Timeline Find(int id)
        {
            using (var db = new ODatabase(OrientDb.DATABASE))
            {

                    var queryWithparam = "select * from timeline where @rid=#" + id + ")";
                    var timelines = db.Query<Timeline>(queryWithparam);

                    if (timelines.Count > 1) throw new ToManyResultsException();
                    if (timelines.Count == 0) throw new TimelineNotFoundException();
                    return TimelineFactory.Create(timelines[0]);
            }
        }
    }
}