using System;
using System.Collections;

namespace ChronoZoom.Backend.Data.Neo4j
{
    public class Timeline
    {
        public int Id { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Title { get; set; }
    }
}