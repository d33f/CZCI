using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface ITimelineDao
    {
        Timeline Find(long id);
        IEnumerable<Timeline> FindAllPublicTimelines();
        Timeline Add(Timeline timeline);
        void Update(Timeline timeline);
    }
}