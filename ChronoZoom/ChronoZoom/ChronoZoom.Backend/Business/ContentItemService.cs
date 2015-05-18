﻿using System.Collections.Generic;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business
{
    public class ContentItemService : IContentItemService
    {
        private readonly IContentItemDao _contentItemDao;

        public ContentItemService(IContentItemDao contentItemDao)
        {
            _contentItemDao = contentItemDao;
        }

        public IEnumerable<ContentItem> GetAll(string parentContentItemID)
        {
            return _contentItemDao.FindAll(parentContentItemID);
        }

        public IEnumerable<ContentItem> GetAllForTimeline(string parentContentItemID)
        {
            return _contentItemDao.FindAllForTimeline(parentContentItemID);
        }
    }
}