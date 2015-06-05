using System.Linq;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Business
{
    public class TimelineService : ITimelineService
    {
        private readonly ITimelineDao _dao;
        private readonly IContentItemDao _contentItemDao;

        public TimelineService(ITimelineDao dao, IContentItemDao contentItemDao)
        {
            _dao = dao;
            _contentItemDao = contentItemDao;
        }

        public Timeline Get(int id)
        {
            Timeline timeline = _dao.Find(id);
            timeline.RootContentItem = _contentItemDao.Find(timeline.RootContentItemId, 1);
            return timeline;
        }

        public IEnumerable<Timeline> GetAllPublicTimelinesWithoutContentItems()
        {
           return _dao.FindAllPublicTimelines();
        }

        public Timeline Add(Timeline timeline)
        {
            return _dao.Add(timeline);
        }

        public void Update(Timeline timeline)
        {
            _dao.Update(timeline);
        }
    }
}