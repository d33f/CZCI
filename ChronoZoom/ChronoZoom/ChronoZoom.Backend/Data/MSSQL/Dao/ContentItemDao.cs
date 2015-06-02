using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Dapper;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class ContentItemDao : IContentItemDao
    {
        public IEnumerable<ContentItem> FindAllBy(long parentID)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                string query = "DECLARE @parent hierarchyId = (SELECT TOP 1 Node FROM [dbo].[ContentItem] WHERE Id = @parentId);";
                query += "(SELECT * FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @parent)";
                
                IEnumerable<ContentItem> contentItems = context.Select<MSSQL.Entities.ContentItem, ContentItem>(query, new { parentId = parentID });
                return contentItems != null ? contentItems : new ContentItem[0];
            }
        }

        public IEnumerable<ContentItem> FindAllForTimelineBy(long timelineID)
        {
            return FindAllBy(timelineID);
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
            using (DatabaseContext context = new DatabaseContext())
            {
                context.Update<MSSQL.Entities.ContentItem, ContentItem>(contentItem, new string[] { "Id", "Timestamp" });
            }
        }
    }
}