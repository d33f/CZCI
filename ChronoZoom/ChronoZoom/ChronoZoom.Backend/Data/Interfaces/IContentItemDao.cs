using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface IContentItemDao
    {
        ContentItem Find(long id, int depth);
        ContentItem Add(ContentItem contentItem);
        void Update(ContentItem contentItem);
    }
}