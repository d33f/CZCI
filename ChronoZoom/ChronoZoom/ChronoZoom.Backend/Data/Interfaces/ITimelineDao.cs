using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface ITimelineDao
    {
        Timeline Find(long id);
        Timeline Add(Timeline timeline);
        void Update(Timeline timeline);
    }
}