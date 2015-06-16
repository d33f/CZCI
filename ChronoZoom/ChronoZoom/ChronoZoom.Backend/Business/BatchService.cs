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
                    Timeline timeline = CreateTimeline(line);

                    ConcurrentDictionary<long, long> idTranslation = new ConcurrentDictionary<long, long>();
                    idTranslation.GetOrAdd(0, timeline.RootContentItemId);

                    CreateContentitems(streamReader, line, idTranslation);

                    return timeline.Id;
                }
            }
        }

        private void CreateContentitems(StreamReader streamReader, string line, ConcurrentDictionary<long, long> idTranslation)
        {
            List<Task> tasks = new List<Task>();
            ConcurrentBag<ContentItem> contentItems = new ConcurrentBag<ContentItem>();
            List<ContentItem> failedContentItems;

            int buffer = 100;
            while ((line = streamReader.ReadLine()) != null)
            {
                string currentLine = line;
                tasks.Add(Task.Factory.StartNew(() => CreateContentItem(idTranslation, contentItems, currentLine)));

                if (tasks.Count() > buffer)
                {
                    Task.WaitAll(tasks.ToArray());
                    tasks.Clear();

                    failedContentItems = RetryAddingContentItems(idTranslation, contentItems);
                    contentItems = new ConcurrentBag<ContentItem>();
                    foreach (ContentItem failedContentItem in failedContentItems)
                    {
                        contentItems.Add(failedContentItem);
                    }
                }
            }

            Task.WaitAll(tasks.ToArray());

            failedContentItems = RetryAddingContentItems(idTranslation, contentItems);
            if (failedContentItems.Count > 0)
            {
                throw new Exception(String.Format("Failed to process {0} content items", failedContentItems.Count));
            }
        }

        private List<ContentItem> RetryAddingContentItems(ConcurrentDictionary<long, long> idTranslation, ConcurrentBag<ContentItem> contentItems)
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

        private void CreateContentItem(ConcurrentDictionary<long, long> idTranslation, ConcurrentBag<ContentItem> contentItems, string currentLine)
        {
            ContentItem contentItem = ConvertJSONToContentItem(currentLine);

            if (!TrySaveContentItem(idTranslation, contentItem))
            {
                contentItems.Add(contentItem);
            }
        }

        private object _trySaveContentItemLock = new object();
        private bool TrySaveContentItem(ConcurrentDictionary<long, long> idTranslation, ContentItem contentItem)
        {
            long parentID;
            if (idTranslation.TryGetValue(contentItem.ParentId, out parentID))
            {
                long id = contentItem.Id;

                contentItem.Id = 0;
                contentItem.ParentId = parentID;

                _contentItemDao.Add(contentItem);
                idTranslation.TryAdd(id, contentItem.Id);

                return true;
            }

            return false;
        }

        private Timeline CreateTimeline(string line)
        {
            Timeline timeline = ConvertJSONToTimeline(line);
            return _timelineDao.Add(timeline);
        }

        private Timeline ConvertJSONToTimeline(string s)
        {
            JObject json = JObject.Parse(s);

            return new Timeline()
            {
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