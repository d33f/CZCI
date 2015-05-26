using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using ChronoZoom.Backend.Data.MSSQL.Entities;

namespace ChronoZoom.Backend.Data.MSSQL.Factory
{
    public class ContentItemFactory
    {
        public static IEnumerable<Backend.Entities.ContentItem> CreateList(int parentId, List<ContentItem> list)
        {
            List<Task> tasks = new List<Task>(list.Count);
            ConcurrentBag<Backend.Entities.ContentItem> contentItems = new ConcurrentBag<Backend.Entities.ContentItem>();
            foreach (var item in list)
            {
                var local = item;
                tasks.Add(Task.Run(() =>
                {
                    var ci = new Backend.Entities.ContentItem()
                    {
                        BeginDate = local.BeginDate,
                        EndDate = local.EndDate,
                        HasChildren = local.HasChildren,
                        Id = local.Id,
                        Priref = local.Priref,
                        Source = local.Source,
                        Title = local.Title,
                        ParentId = local.ParentId
                    };
                    contentItems.Add(ci);
                }));
            }

            Task.WaitAll(tasks.ToArray());
            return contentItems;
        }
    }
}