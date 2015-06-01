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
            var contentItems = _contentItemDao.FindAllForTimelineBy(timeline.Id);
            timeline.ContentItems = contentItems.ToArray();
            return timeline;
        }

        public IEnumerable<Timeline> List()
        {
           var timelines = _dao.List();
           return timelines;
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