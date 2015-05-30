using System.Collections.Generic;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business
{
    public class ContentItemService : IContentItemService
    {
        private readonly IContentItemDao _dao;

        public ContentItemService(IContentItemDao dao)
        {
            _dao = dao;
        }

        public IEnumerable<ContentItem> GetAll(int parentContentItemID)
        {
            return _dao.FindAllBy(parentContentItemID);
        }

        public ContentItem Add(ContentItem contentItem)
        {
            return _dao.Add(contentItem);
        }

        public void Update(ContentItem contentItem)
        {
            _dao.Update(contentItem);
        }
    }
}