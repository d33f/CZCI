using ChronoZoomImporter.EF;
using ChronoZoomImporter.Neo4j;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace ChronoZoomImporter
{
    class Program
    {
        static void Main(string[] args)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                context.Configuration.ValidateOnSaveEnabled = false;

                Console.WriteLine("XMLToSQL!");
                //XMLToSQL(context);

                Console.WriteLine("SQLToNeo4j!");
                SQLToNeo4j(context);

                Console.WriteLine("done!");
                Console.ReadKey();
            }
        }

        private static void XMLToSQL(DatabaseContext context)
        {
            XElement document = Download();
            if (document != null)
            {
                IEnumerable<XElement> records = document.Element("recordList").Elements("record");

                AddContentItems(records, context);

                GroupContentItems(context);
            }
        }

        private static void GroupContentItems(DatabaseContext context)
        {
            for(int i = 0; i <= 5; i++) {
                Console.WriteLine("Processing : depth {0}", i); 
                GroupContentItems(context, i);
            }
        }

        private static void GroupContentItems(DatabaseContext context, int depth) {
            EF.ContentItem[] possibleParentContentItems = context.ContentItems.Where(w => w.Depth == depth).Select(x => new { 
                Range = x.EndDate - x.BeginDate,
                ContentItem = x
            }).OrderByDescending(o => o.Range).Select(x => x.ContentItem).ToArray();

            List<EF.ContentItem> parents = new List<EF.ContentItem>();
            foreach (var item in possibleParentContentItems)
            {
                if (parents.Count() == 0 || item.EndDate < parents.Min(x => x.BeginDate) || item.BeginDate > parents.Max(x => x.EndDate)
                || parents.All(x => item.EndDate < x.BeginDate || item.BeginDate > x.EndDate))
                {
                    parents.Add(item);
                }
            }

            context.Configuration.AutoDetectChangesEnabled = true;
            int[] parentIDs = parents.Select(x => x.ID).ToArray();

            foreach (var parent in parents)
            {
                var contentItems = context.ContentItems.Where(w => w.Depth == depth && w.BeginDate >= parent.BeginDate && w.EndDate <= parent.EndDate && !parentIDs.Contains(w.ID));
                if (contentItems.Any())
                {
                    foreach (var contentItem in contentItems)
                    {
                        contentItem.Depth = depth + 1;
                        contentItem.ParentID = parent.ID;
                    }
                    parent.HasChildren = true;
                }
                context.SaveChanges();
            }
        }

        private static void AddContentItems(IEnumerable<XElement> records, DatabaseContext context)
        {
            context.Configuration.AutoDetectChangesEnabled = false;

            int i = 0;
            foreach (XElement record in records)
            {
                AddContentItem(context, record);
                i++;

                if (i % 100 == 0)
                {
                    context.SaveChanges();
                }
            }
            context.SaveChanges();
        }

        private static void AddContentItem(DatabaseContext context, XElement record)
        {
            try
            {
                context.ContentItems.Add(new EF.ContentItem()
                {
                    BeginDate = Decimal.Parse(record.Element("production.date.start").Value),
                    EndDate = Decimal.Parse(record.Element("production.date.end").Value),
                    Source = "http://amdata.adlibsoft.com/wwwopac.ashx?database=AMcollect&search=priref=" + record.Element("priref").Value,
                    Title = record.Element("title").Value,
                    ParentID = -1,
                    Depth = 0,
                    HasChildren = false
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Record failed..." + ex.Message);
            } 
        }
        
        private static XElement Download()
        {
            //XElement document = XElement.Load("http://amdata.adlibsoft.com/wwwopac.ashx?database=AMcollect&search=all&limit=1");
            XElement document = XElement.Load(@"D:\Downloads\wwwopac.xml");
            Console.WriteLine("Downloaded !");
            return document;
        }

        private static void SQLToNeo4j(DatabaseContext context)
        {
            GraphClient client = new GraphClient(new Uri("http://neo4j:password@localhost:7474/db/data"));
            client.Connect();

            CreateNeo4jTimeline(context, client);

            EF.ContentItem[] contentItems = context.ContentItems.Where(x => x.Depth == 0).ToArray();
            foreach (EF.ContentItem contentItem in contentItems)
            {
                CreateNeo4jContentItem(client, contentItem);
                CreateNeo4jContentItemWithChildren(context, client, contentItem.ID);
            }
        }

        private static void CreateNeo4jContentItemWithChildren(DatabaseContext context, GraphClient client, int parentID)
        {
            EF.ContentItem[] contentItems = context.ContentItems.Where(x => x.ParentID == parentID).ToArray();
            foreach (EF.ContentItem ef in contentItems)
            {
                CreateNeo4jContentItem(client, ef);

                client.Cypher
                    .Match("(contentItem1:ContentItem)", "(contentItem2:ContentItem)")
                    .Where((Neo4j.ContentItem contentItem1) => contentItem1.ID == parentID)
                    .AndWhere((Neo4j.ContentItem contentItem2) => contentItem2.ID == ef.ID)
                    .Create("contentItem1-[:child]->contentItem2")
                    .ExecuteWithoutResults();

                if (ef.HasChildren)
                {
                    CreateNeo4jContentItemWithChildren(context, client, ef.ID);
                }
            }
        }

        private static void CreateNeo4jContentItem(GraphClient client, EF.ContentItem ef)
        {
            Neo4j.ContentItem contentItem = new Neo4j.ContentItem()
            {
                ID = ef.ID,
                Title = ef.Title,
                BeginDate = ef.BeginDate,
                EndDate = ef.EndDate,
                Depth = ef.Depth,
                Source = ef.Source,
                ParentID = ef.ParentID,
                HasChildren = ef.HasChildren,
            };

            client.Cypher
                .Match("(timeline:Timeline)")
                .Where((Neo4j.Timeline timeline) => timeline.Id == 1)
                .Create("timeline-[:contains]->(contentItem:ContentItem {contentItem})")
                .WithParam("contentItem", contentItem)
                .ExecuteWithoutResults();
        }

        private static void CreateNeo4jTimeline(DatabaseContext context, GraphClient client)
        {
            Neo4j.Timeline timeline = new Neo4j.Timeline()
            {
                Id = 1,
                BeginDate = context.ContentItems.Min(x => x.BeginDate),
                EndDate = context.ContentItems.Max(x => x.EndDate),
                Title = "Test timeline",
            };

            client.Cypher
                .Merge("(timeline:Timeline { Id: {id} })").OnCreate()
                .Set("timeline = {timeline}")
                .WithParams(new
                {
                    id = timeline.Id,
                    timeline = timeline
                })
                .ExecuteWithoutResults();
        }

        //private static void SQLToNeo4j(DatabaseContext context)
        //{
        //    GraphClient client = new GraphClient(new Uri("http://neo4j:password@localhost:7474/db/data"));
        //    client.Connect();

        //    NodeReference<Neo4j.Timeline> timeline = CreateNeo4jTimeline(context, client);

        //    EF.ContentItem[] contentItems = context.ContentItems.Where(x => x.Depth == 0).ToArray();
        //    foreach(EF.ContentItem contentItem in contentItems)
        //    {
        //        NodeReference<Neo4j.ContentItem> parentNeo4j = CreateNeo4jContentItem(client, contentItem, timeline);
        //        CreateNeo4jContentItemWithChildren(context, client, contentItem.ID, timeline, parentNeo4j);
        //    }
        //}

        //private static void CreateNeo4jContentItemWithChildren(DatabaseContext context, GraphClient client, int parentID, NodeReference<Neo4j.Timeline> timeline, NodeReference<Neo4j.ContentItem> parentNeo4j)
        //{
        //    EF.ContentItem[] contentItems = context.ContentItems.Where(x => x.ParentID == parentID).ToArray();
        //    foreach (EF.ContentItem contentItem in contentItems)
        //    {
        //        NodeReference<Neo4j.ContentItem> neo4j = CreateNeo4jContentItem(client, contentItem, timeline);

        //        client.CreateRelationship(parentNeo4j, new ContentItemChildrenRelationship(neo4j));

        //        if (contentItem.HasChildren)
        //        {
        //            CreateNeo4jContentItemWithChildren(context, client, contentItem.ID, timeline, neo4j);
        //        }
        //    }
        //}

        //private static NodeReference<Neo4j.ContentItem> CreateNeo4jContentItem(GraphClient client, EF.ContentItem ef, NodeReference<Neo4j.Timeline> timeline)
        //{
        //    NodeReference<Neo4j.ContentItem> neo4j = client.Create(new Neo4j.ContentItem()
        //    {
        //        ID = ef.ID,
        //        Title = ef.Title,
        //        BeginDate = ef.BeginDate,
        //        EndDate = ef.EndDate,
        //        Depth = ef.Depth,
        //        Source = ef.Source,
        //        ParentID = ef.ParentID,
        //        HasChildren = ef.HasChildren,
        //    });

        //    client.CreateRelationship(timeline, new TimelineContentItemRelationship(neo4j));

        //    return neo4j;
        //}

        //private static NodeReference<Neo4j.Timeline> CreateNeo4jTimeline(DatabaseContext context, GraphClient client)
        //{
        //    NodeReference<Neo4j.Timeline> timeline = client.Create(new Neo4j.Timeline()
        //    {
        //        Id = 1,
        //        BeginDate = context.ContentItems.Min(x => x.BeginDate),
        //        EndDate = context.ContentItems.Max(x => x.EndDate),
        //        Title = "Test timeline",
        //    });
        //    return timeline;
        //}
    }
}
