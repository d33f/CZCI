using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using Neo4jClient;
using ChronoZoom.Backend.Properties;

namespace ChronoZoom.Backend.Data
{
    public class ContentItemDao : BaseDao, IContentItemDao
    {
        //Commit test
        public IEnumerable<Entities.ContentItem> FindAll(int parentID)
        {
            return _client.Cypher.Match("(contentItem:ContentItem)")
                .Where((Neo4j.ContentItem contentItem) => contentItem.ParentID == parentID)
                .Return(contentItem => contentItem.As<Neo4j.ContentItem>()).Results.Select(x => new Entities.ContentItem()
                {
                    Id = x.ID,
                    Title = x.Title,
                    BeginDate = x.BeginDate,
                    EndDate = x.EndDate,
                    Depth = x.Depth,
                    Source = x.Source,
                    ParentId = x.ParentID,
                    HasChildren = x.HasChildren,
                });
        }
    }
}