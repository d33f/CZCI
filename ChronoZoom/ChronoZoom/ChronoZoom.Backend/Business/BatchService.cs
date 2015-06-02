using ChronoZoom.Backend.Business.Interfaces;
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
        public int ProcessFile(string filename)
        {
            using (FileStream fileStream = File.OpenRead(filename))
            {
                using (StreamReader streamReader = new StreamReader(fileStream, Encoding.UTF8, true, 128)) 
                {
                    string line = streamReader.ReadLine();
                    Timeline timeline = CreateTimeline(line);

                    List<Task> tasks = new List<Task>();
                    ConcurrentBag<ContentItem> contentItems = new ConcurrentBag<ContentItem>();
                    while ((line = streamReader.ReadLine()) != null)
                    {
                        tasks.Add(Task.Factory.StartNew(() => contentItems.Add(CreateContentItem(line))));
                    }

                    Task.WaitAll(tasks.ToArray());

                    var x = timeline;
                    var y = contentItems;
                    return -1;
                }
            }
        }

        private Timeline CreateTimeline(string s)
        {
            JObject json = JObject.Parse(s);

            return new Timeline()
            {
                BeginDate = (decimal)json["BeginDate"],
                EndDate = (decimal)json["EndDate"],
                Title = (string)json["Title"]
            };
        }

        private ContentItem CreateContentItem(string s)
        {
            JObject json = JObject.Parse(s);

            return new ContentItem()
            {
                Id = (long)json["Id"],
                ParentId = (long)json["ParentId"],

                BeginDate = (decimal)json["BeginDate"],
                EndDate = (decimal)json["EndDate"],
                Title = (string)json["Title"],
                HasChildren = (bool)json["HasChildren"],
                PictureURL = (string)json["PictureURL"],
                SourceURL = (string)json["SourceURL"],
                SourceRef = (string)json["SourceRef"]
            };
        }
    }
}