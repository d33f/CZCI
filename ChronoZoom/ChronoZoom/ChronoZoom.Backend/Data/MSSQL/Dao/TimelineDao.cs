using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using Dapper;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class TimelineDao : ITimelineDao
    {
        public Timeline Find(long id)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                string query = "DECLARE @root HierarchyId = (SELECT Node FROM [dbo].[ContentItem] WHERE ID = 1);";
                query += "(SELECT * FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @root AND id = @id)";
                Timeline timeline = context.FirstOrDefault<MSSQL.Entities.ContentItem, Timeline>(query, new { id = id });
                if (timeline == null)
                {
                    throw new TimelineNotFoundException();
                }
                return timeline;
            }
        }

        public IEnumerable<Timeline> FindAllPublicTimelines()
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                string query = "DECLARE @root HierarchyId = (SELECT Node FROM [dbo].[ContentItem] WHERE ID = 1);";
                query += "(SELECT * FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @root)";
                IEnumerable<Timeline> timelines = context.Select<MSSQL.Entities.ContentItem, Timeline>(query, null);
                return timelines != null ? timelines : new Timeline[0];
            }
        }

        public Timeline Add(Timeline timeline)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                ContentItem contentItem = new ContentItem()
                {
                    ParentId = 1,
                    BeginDate = timeline.BeginDate,
                    EndDate = timeline.EndDate,
                    HasChildren = true,
                    Title = timeline.Title
                };

                contentItem = context.AddContentItem<MSSQL.Entities.ContentItem, ContentItem>(contentItem);
                timeline.Id = contentItem.Id;

                return timeline;
            }
        }

        public void Update(Timeline timeline)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                context.Update<MSSQL.Entities.ContentItem, Timeline>(timeline, new string[] { "Id", "Timestamp" });
            }
        }
    }
}