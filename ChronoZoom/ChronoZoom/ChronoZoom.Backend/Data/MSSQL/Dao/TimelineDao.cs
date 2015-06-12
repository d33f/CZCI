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
                string query = "SELECT TOP 1 [Timeline].[Id], BackgroundUrl,[RootContentItemId],[IsPublic],[BeginDate],[EndDate],[Title],[Description],[Timeline].[Timestamp] FROM [dbo].[Timeline] JOIN [dbo].[ContentItem] ON [dbo].[Timeline].[RootContentItemId] = [dbo].[ContentItem].[Id] where [Timeline].[Id] = @id";
                Timeline timeline = context.FirstOrDefault<MSSQL.Entities.TimelineJoinContentItem, Timeline>(query, new { id = id });
                if (timeline == null)
                {
                    throw new TimelineNotFoundException();
                }
                return timeline;
            }
        }

        public IEnumerable<TimelineSummary> FindAllPublicTimelines()
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                string query = "SELECT [Timeline].[Id],[Title],[Description] FROM [dbo].[Timeline] JOIN [dbo].[ContentItem] ON [dbo].[Timeline].[RootContentItemId] = [dbo].[ContentItem].[Id] where IsPublic=1";
                return context.Select<MSSQL.Entities.TimelineJoinContentItem, TimelineSummary>(query);
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
                    Title = timeline.Title,
                    Description = timeline.Description
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