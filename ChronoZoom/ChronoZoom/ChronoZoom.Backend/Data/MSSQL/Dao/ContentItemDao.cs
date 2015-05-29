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
            using (DatabaseContext context = new DatabaseContext())
            {
                string query = "DECLARE @parent hierarchyId = (SELECT Node FROM [dbo].[ContentItem] WHERE Id = @parentId);";
                query += "(SELECT * FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @parent)";
                
                // above code is new query
                return context.Select<MSSQL.Entities.ContentItem, ContentItem>("select * from contentitem where parentId=@parentId", new { parentId = parentID });
            }
        }

        public IEnumerable<ContentItem> FindAllForTimelineBy(int timelineID)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                return context.Select<MSSQL.Entities.ContentItem, ContentItem>("select * from contentitem where timelineId=@timelineId", new { timelineId = timelineID });
            }
        }

        public ContentItem Add(ContentItem contentItem)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                return context.AddContentItem<MSSQL.Entities.ContentItem, ContentItem>(contentItem);
            }
        }

        public void Update(ContentItem contentItem)
        {
            throw new System.NotImplementedException();
        }
    }
}