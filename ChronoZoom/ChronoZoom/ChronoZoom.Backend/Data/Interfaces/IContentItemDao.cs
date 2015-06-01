using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface IContentItemDao
    {
        IEnumerable<ContentItem> FindAllBy(long parentID);
        IEnumerable<ContentItem> FindAllForTimelineBy(long timelineID);
        ContentItem Add(ContentItem contentItem);
        void Update(ContentItem contentItem);
    }
}