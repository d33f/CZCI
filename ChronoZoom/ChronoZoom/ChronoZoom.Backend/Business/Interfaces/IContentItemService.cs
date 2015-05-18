using System.Collections.Generic;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface IContentItemService
    {
        IEnumerable<ContentItem> GetAll(string parentContentItemID);
        IEnumerable<ContentItem> GetAllForTimeline(string parentContentItemID);
    }
}