using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database
{
    public class Connection
    {
        GraphClient client;

        public Connection()
        {
            client = new GraphClient(new Uri("http://neo4j:neo@84.25.163.6:7474/db/data"));
        }

        public bool Open()
        {
            try
            {
                client.Connect();
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public GraphClient GetClient()
        {
            return client;
        }
    }
}
