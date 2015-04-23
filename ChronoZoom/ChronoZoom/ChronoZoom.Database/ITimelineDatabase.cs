using ChronoZoom.Database.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Database
{
    public interface ITimelineDatabase
    {
        IEnumerable<Timeline> List();
        Timeline FindTimeline(int id);
    }
}
