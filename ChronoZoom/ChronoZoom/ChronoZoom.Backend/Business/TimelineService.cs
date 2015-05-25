using System.Collections.Generic;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;

namespace ChronoZoom.Backend.Business
{
    public class TimelineService : ITimelineService
    {
        private ITimelineDao _timelineDao;

        public TimelineService(ITimelineDao timelineDao)
        {
            _timelineDao = timelineDao;
        }

        public Entities.Timeline Get(int id)
        {
            return _timelineDao.Find(id);
        }

        public void Add(Entities.Timeline timeline)
        {
            throw new System.NotImplementedException();
        }
    }
}