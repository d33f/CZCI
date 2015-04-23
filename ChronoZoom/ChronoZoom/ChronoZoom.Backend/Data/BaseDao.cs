using ChronoZoom.Backend.Properties;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data
{
    public class BaseDao
    {
        protected GraphClient _client;

        public BaseDao()
        {
            _client = new GraphClient(new Uri(Settings.Default.Neo4jServerAddress));
            _client.Connect();
        }
    }
}