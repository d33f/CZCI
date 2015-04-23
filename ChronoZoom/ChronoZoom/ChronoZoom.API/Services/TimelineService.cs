
using ChronoZoom.Database;
using ChronoZoom.Database.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.API.Services
{
    public class TimelineService : ITimelineService
    {
        private ITimelineDatabase database;

        public TimelineService(ITimelineDatabase database)
        {
            this.database = database;
        }

        public IEnumerable<Entities.Timeline> GetTimelines()
        {
            List<Entities.Timeline> timelines = new List<Entities.Timeline>();

            // Convert database timeline properties to compatible properties
            var convertedTimelines = database.List().Select(x => new Entities.Timeline
            {
                Id = x.Id,
                BeginDate = x.BeginDate,
                EndDate = x.EndDate,
                Title = x.Title,
                ContentItems = ConvertContentItems(x.ContentItems),
            });

            timelines.AddRange(convertedTimelines);
            return timelines;
        }

        private Entities.ContentItem[] ConvertContentItems(IEnumerable<ContentItem> contentItems)
        {
            return contentItems.Select(contentItem => new Entities.ContentItem()
            {
                Id = contentItem.Id,
                BeginDate = contentItem.BeginDate,
                EndDate = contentItem.EndDate,
                Title = contentItem.Title,
                Depth = contentItem.Depth,
                HasChildren = contentItem.HasChildren,
                Source = contentItem.Source
            }).ToArray();
        }

        public Entities.Timeline FindTimeline(int id)
        {
            Timeline timeline = database.FindTimeline(id);
            return new Entities.Timeline()
            {
                Title = timeline.Title,
                BeginDate = timeline.BeginDate,
                EndDate = timeline.EndDate,
                ContentItems = ConvertContentItems(timeline.ContentItems)
            };
        }
    }
}