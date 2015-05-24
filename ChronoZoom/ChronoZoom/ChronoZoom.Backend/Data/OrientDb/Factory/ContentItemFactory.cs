using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ChronoZoom.Backend.Data.OrientDb.Factory
{
    public class ContentItemFactory
    {
        public static IEnumerable<Entities.ContentItem> CreateList(string parentId, List<ContentItem> list)
        {
            List<Task> tasks = new List<Task>(list.Count);
            ConcurrentBag<Entities.ContentItem> contentItems = new ConcurrentBag<Entities.ContentItem>();
            foreach (var item in list)
            {
                var local = item;
                tasks.Add(Task.Run(() =>
                {
                    var id = local.ORID.RID.Substring(1, local.ORID.RID.Length-1);
                    var ci = new Entities.ContentItem()
                    {
                        BeginDate = local.BeginDate,
                        EndDate = local.EndDate,
                        HasChildren = local.HasChildren,
                        Id =id,
                       // Priref = local.Priref,
                        Source = local.Source,
                        Title = local.Title,
                        ParentId = parentId
                    };
                    contentItems.Add(ci);
                }));
            }

            Task.WaitAll(tasks.ToArray());
            return contentItems;
        }
    }
}