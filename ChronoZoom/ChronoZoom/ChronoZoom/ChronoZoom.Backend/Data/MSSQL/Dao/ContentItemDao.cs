using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Dapper;
using System.Linq;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class ContentItemDao : IContentItemDao
    {
        public ContentItem Find(long id, int depth)
        {
            List<ContentItem> contentItems = null;

            using (DatabaseContext context = new DatabaseContext())
            {
                string query = "DECLARE @parent hierarchyId = (SELECT TOP 1 Node FROM [dbo].[ContentItem] WHERE Id = @id);";
                query += "SELECT * FROM [dbo].[ContentItem] WHERE Node = @parent ";

                for (int i = 1; i <= depth; i++)
                {
                    query += " OR Node.GetAncestor(" + i + ") = @parent";
                }

                contentItems = context.Select<MSSQL.Entities.ContentItem, ContentItem>(query, new { id = id, }).ToList();
            }

            if (contentItems != null && contentItems.Any())
            {
                ContentItem parentContentItem = contentItems.Single(contentItem => contentItem.Id == id);
                contentItems.Remove(parentContentItem);
                return ContentItemsToTree(parentContentItem, contentItems);
            }

            return null;
        }

        private ContentItem ContentItemsToTree(ContentItem parentContentItem, List<ContentItem> contentItems)
        {
            parentContentItem.Children = contentItems.AsParallel().Where(contentItem => contentItem.ParentId == parentContentItem.Id).ToArray();

            foreach (ContentItem contentItem in parentContentItem.Children)
            {
                contentItems.Remove(contentItem);
            }

            for (int i = 0; i < parentContentItem.Children.Length; i++)
            {
                parentContentItem.Children[i] = ContentItemsToTree(parentContentItem.Children[i], contentItems);
            }

            return parentContentItem;
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