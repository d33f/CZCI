using System.Collections.Generic;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface IContentItemService
    {
        IEnumerable<ContentItem> GetAll(int parentContentItemID);
        ContentItem Add(ContentItem contentItem);
        void Update(ContentItem contentItem);
    }
}