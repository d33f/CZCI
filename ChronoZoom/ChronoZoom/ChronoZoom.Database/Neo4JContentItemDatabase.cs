using ChronoZoom.Database.Entities;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database
{
    public class Neo4JContentItemDatabase : IContentItemDatabase
    {
        Connection connection;
        GraphClient client;

        public Neo4JContentItemDatabase()
        {
            connection = new Connection();
            connection.Open();
            client = connection.GetClient();
        }

        public Entities.ContentItem Find(int id)
        {
            return client.Cypher.Match("(contentItem:ContentItem)")
                .Where((ContentItem contentItem) => contentItem.Id == id)
                .Return(contentItem => contentItem.As<ContentItem>()).Results.FirstOrDefault();
        }

        public IEnumerable<Entities.ContentItem> List()
        {
            return client.Cypher.Match("(contentItem:ContentItem)")
                .Return(contentItem => contentItem.As<Entities.ContentItem>()).Results;
        }

        public void CreateContentItem(ContentItem ContentItem, long TimelineId)
        {
            client.Cypher.Match("(timeline:Timeline)").Where((DBEntities.Timeline timeline) => timeline.Id == TimelineId)
                .Create("timeline-[:Contains]->(contentItem:ContentItem {ContentItem})").WithParam("ContentItem", ContentItem).ExecuteWithoutResults();
        }
    }
}
