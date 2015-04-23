using ChronoZoom.Database;
using ChronoZoom.Database.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.API.Services
{
    public class ContentItemService : IContentItemService
    {
        private IContentItemDatabase database;

        public ContentItemService (IContentItemDatabase database)
        {
            this.database = database;
        }

        public IEnumerable<Entities.ContentItem> FindContentItems(int parentContentItemID)
        {
            // Convert database timeline properties to compatible properties
            return database.List().Select(contentItem => new Entities.ContentItem()
            {
                Id = contentItem.Id,
                BeginDate = contentItem.BeginDate,
                EndDate = contentItem.EndDate,
                Title = contentItem.Title,
                Depth = contentItem.Depth,
                HasChildren = contentItem.HasChildren,
                Source = contentItem.Source
            }).ToList();
        }
    }
}