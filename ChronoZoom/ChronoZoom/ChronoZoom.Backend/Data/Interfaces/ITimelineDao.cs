using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface ITimelineDao
    {
        Timeline Find(long id);
        IEnumerable<TimelineSummary> FindAllPublicTimelines();
        Timeline Add(Timeline timeline);
        void Update(Timeline timeline);
    }
}