using ChronoZoom.Database.DBEntities;
using ChronoZoom.Database.Entities;
using Neo4jClient;
using Neo4jClient.Cypher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database
{
    public class Neo4JTimelineDatabase : ITimelineDatabase
    {
        Connection connection;
        GraphClient client;

        public Neo4JTimelineDatabase()
        {
            connection = new Connection();
            connection.Open();
            client = connection.GetClient();
        }

        public void CreateTimeline(DBEntities.Timeline Timeline)
        {
            client.Cypher.Create("(timeline:Timeline {Timeline})").WithParam("Timeline", Timeline).ExecuteWithoutResults();
        }

        public Entities.Timeline FindTimeline(int id)
        {
            var Timeline = client.Cypher.Match("(timeline:Timeline)").Where((DBEntities.Timeline timeline) => timeline.Id == id)
                .OptionalMatch("(timeline)-[Contains]-(contentItem:ContentItem)")
                 .Return((timeline, contentItem) => new
                 {
                     TM = timeline.As<DBEntities.Timeline>(),
                     CI = Return.As<IEnumerable<ContentItem>>("collect(contentItem)")
                 }).Results.FirstOrDefault();
            return new Entities.Timeline(Timeline.TM, Timeline.CI);
        }

        public IEnumerable<Entities.Timeline> List()
        {
            List<Entities.Timeline> Timelines = new List<Entities.Timeline>();
            foreach (var Timeline in client.Cypher.Match("(timeline:Timeline)")
                .OptionalMatch("(timeline)-[Contains]-(contentItem:ContentItem)")
                .Return((timeline, contentItem) => new
                {
                    TM = timeline.As<DBEntities.Timeline>(),
                    CI = Return.As<IEnumerable<ContentItem>>("collect(contentItem)")
                }).Results)
            {
                Timelines.Add(new Entities.Timeline(Timeline.TM, Timeline.CI));
            }
            return Timelines;
        }
    }
}
