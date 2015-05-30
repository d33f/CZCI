using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface ITimelineService
    {
        Timeline Get(int id);
        Timeline Add(Timeline timeline);
        void Update(Timeline timeline);
    }
}