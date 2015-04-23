using System;

namespace ChronoZoom.Backend.Data.Neo4j
{
    public class ContentItem
    {
        public int ID { get; set; }
        public int ParentID { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public String Title { get; set; }
        public int Depth { get; set; }
        public bool HasChildren { get; set; }
        public String Source { get; set; }
    }
}