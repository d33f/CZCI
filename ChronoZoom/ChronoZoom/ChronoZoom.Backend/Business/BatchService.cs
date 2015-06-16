using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ChronoZoom.Backend.Business
{
    public class BatchService : IBatchService
    {
        private readonly IContentItemDao _contentItemDao;
        private readonly ITimelineDao _timelineDao;

        public BatchService(IContentItemDao contentItemDao, ITimelineDao timelineDao)
        {
            _contentItemDao = contentItemDao;
            _timelineDao = timelineDao;
        }

        public long ProcessFile(string filename)
        {
            using (FileStream fileStream = File.OpenRead(filename))
            {
                using (StreamReader streamReader = new StreamReader(fileStream, Encoding.UTF8, true, 128)) 
                {
                    string line = streamReader.ReadLine();
                    Timeline timeline = ConvertJSONToTimeline(line);
                    long timelineID = timeline.Id;
                    timeline = _timelineDao.Add(timeline);

                    Dictionary<long, long> idTranslation = new Dictionary<long, long>();
                    idTranslation.Add(timelineID, timeline.RootContentItemId);

                    CreateContentitems(streamReader, line, idTranslation);

                    return timeline.Id;
                }
            }
        }

        private void CreateContentitems(StreamReader streamReader, string line, Dictionary<long, long> idTranslation)
        {
            List<ContentItem> failedContentItems = new List<ContentItem>();

            while ((line = streamReader.ReadLine()) != null)
            {
                ContentItem contentItem = ConvertJSONToContentItem(line);

                if (!TrySaveContentItem(idTranslation, contentItem))
                {
                    failedContentItems.Add(contentItem);
                }
            }
            
            failedContentItems = TryAddingContentItems(idTranslation, failedContentItems);
            if (failedContentItems.Count > 0)
            {
                throw new Exception(String.Format("Failed to process {0} content items", failedContentItems.Count));
            }
        }

        private List<ContentItem> TryAddingContentItems(Dictionary<long, long> idTranslation, IEnumerable<ContentItem> contentItems)
        {
            List<ContentItem> failedContentItems = new List<ContentItem>();
            foreach (ContentItem contentItem in contentItems.OrderBy(o => o.Id))
            {
                if (!TrySaveContentItem(idTranslation, contentItem))
                {
                    failedContentItems.Add(contentItem);
                }
            }
            return failedContentItems;
        }

        private bool TrySaveContentItem(Dictionary<long, long> idTranslation, ContentItem contentItem)
        {
            long parentID;
            if (idTranslation.TryGetValue(contentItem.ParentId, out parentID))
            {
                long id = contentItem.Id;

                contentItem.Id = 0;
                contentItem.ParentId = parentID;

                _contentItemDao.Add(contentItem);
                idTranslation.Add(id, contentItem.Id);

                return true;
            }

            return false;
        }

        private Timeline ConvertJSONToTimeline(string s)
        {
            JObject json = JObject.Parse(s);

            return new Timeline()
            {
                Id = (long)json["Id"],
                BeginDate = (decimal)json["BeginDate"],
                EndDate = (decimal)json["EndDate"],
                Title = (string)json["Title"],
                Description = (string)json["Description"],
                IsPublic = (bool)json["IsPublic"]
            };
        }

        private ContentItem ConvertJSONToContentItem(string s)
        {
            JObject json = JObject.Parse(s);
            return new ContentItem()
            {
                Id = (long)json["Id"],
                ParentId = (long)json["ParentId"],

                BeginDate = (decimal)json["BeginDate"],
                EndDate = (decimal)json["EndDate"],
                Title = (string)json["Title"],
                Description = (string)json["Description"],
                HasChildren = (bool)json["HasChildren"],
                PictureURLs = json["PictureURLs"].ToObject<string[]>(),
                SourceURL = (string)json["SourceURL"],
                SourceRef = (string)json["SourceRef"]
            };
        }
    }
}