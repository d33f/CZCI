using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface ITimelineService
    {
        Timeline Get(int id);
        IEnumerable<Timeline> List();
        Timeline Add(Timeline timeline);
        void Update(Timeline timeline);
    }
}