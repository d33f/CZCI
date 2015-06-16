using System.Collections.Generic;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface IContentItemService
    {
        ContentItem Find(long id, int depth);
        ContentItem Add(ContentItem contentItem);
        void Update(ContentItem contentItem);
    }
}