using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using Neo4jClient.Cypher;

namespace ChronoZoom.Backend.Data
{
    public class TimelineDao : BaseDao, ITimelineDao
    {
        public Entities.Timeline Find(int id)
        {
            var result = _client.Cypher.Match("(timeline:Timeline)").Where((Neo4j.Timeline timeline) => timeline.Id == id)
                .OptionalMatch("(timeline)-[contains]-(contentItem:ContentItem)")
                 .Return((timeline, contentItem) => new
                 {
                     Timeline = timeline.As<Neo4j.Timeline>(),
                     ContentItems = Return.As<IEnumerable<Neo4j.ContentItem>>("collect(contentItem)")
                 }).Results.FirstOrDefault();

            return new Entities.Timeline()
            {
                Id = result.Timeline.Id,
                BeginDate = result.Timeline.BeginDate,
                EndDate = result.Timeline.EndDate,
                Title = result.Timeline.Title,
                ContentItems = result.ContentItems.Select(x => new Entities.ContentItem()
                {
                    Id = x.ID,
                    BeginDate = x.BeginDate,
                    EndDate = x.EndDate,
                    Title = x.Title,
                    Source = x.Source,
                    Depth = x.Depth,
                    HasChildren = x.HasChildren,
                    ParentId = x.ParentID
                })
                // todo remove this for neo4j code
                .Where(w => w.HasChildren && w.Depth == 0)
                // end remove
                .ToArray()
            };
        }
    }
}