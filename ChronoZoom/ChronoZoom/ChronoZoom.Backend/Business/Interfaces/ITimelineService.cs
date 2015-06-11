using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface ITimelineService
    {
        Timeline Get(int id);
        IEnumerable<TimelineSummary> GetAllTimelineSummariesForPublicTimelines();
        Timeline Add(Timeline timeline);
        void Update(Timeline timeline);
    }
}