using ChronoZoom.Database.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Database
{
    public interface IContentItemDatabase
    {
        ContentItem Find(int id);

        IEnumerable<ContentItem> List();
    }
}
