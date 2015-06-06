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
                string query = "SELECT TOP 1 [Timeline].[Id],[RootContentItemId],[IsPublic],[BeginDate],[EndDate],[Title],[Description],[Timeline].[Timestamp] FROM [dbo].[Timeline] JOIN [dbo].[ContentItem] ON [dbo].[Timeline].[RootContentItemId] = [dbo].[ContentItem].[Id] where [Timeline].[Id] = @id";
                Timeline timeline = context.FirstOrDefault<MSSQL.Entities.TimelineJoinContentItem, Timeline>(query, new { id = id });
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
                string query = "SELECT [Timeline].[Id],[RootContentItemId],[IsPublic],[BeginDate],[EndDate],[Title],[Description],[Timeline].[Timestamp] FROM [dbo].[Timeline] JOIN [dbo].[ContentItem] ON [dbo].[Timeline].[RootContentItemId] = [dbo].[ContentItem].[Id] where IsPublic=1";

                var c = context.Select<MSSQL.Entities.TimelineJoinContentItem, Timeline>(query);
                return c;
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
                timeline.RootContentItemId = contentItem.Id;

                return context.Add<MSSQL.Entities.Timeline, Timeline>(timeline, new string[] { "Id", "Timestamp" });
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