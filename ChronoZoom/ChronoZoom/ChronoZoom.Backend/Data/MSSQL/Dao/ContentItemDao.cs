using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Dapper;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class ContentItemDao : IContentItemDao
    {
        public IEnumerable<ContentItem> FindAllBy(int parentID)
        {
            using (DatabaseContext query = new DatabaseContext())
            {
                return query.Select<MSSQL.Entities.ContentItem, ContentItem>("select * from contentitem where parentId=@parentId",new {parentId = parentID});
            }
        }

        public IEnumerable<ContentItem> FindAllForTimelineBy(int timelineID)
        {
            using (DatabaseContext query = new DatabaseContext())
            {
                return query.Select<MSSQL.Entities.ContentItem, ContentItem>("select * from contentitem where timelineId=@timelineId", new { timelineId = timelineID });
            }
        }

        public ContentItem Add(ContentItem contentItem)
        {
            throw new System.NotImplementedException();
        }

        public void Update(ContentItem contentItem)
        {
            throw new System.NotImplementedException();
        }
    }
}