using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface IContentItemDao
    {
        IEnumerable<ContentItem> FindAllBy(int parentID);
        IEnumerable<ContentItem> FindAllForTimelineBy(int timelineID);
        ContentItem Add(ContentItem contentItem);
        void Update(ContentItem contentItem);
    }
}