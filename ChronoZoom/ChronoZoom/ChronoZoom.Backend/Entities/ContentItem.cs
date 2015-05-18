using System;

namespace ChronoZoom.Backend.Entities
{
    public class ContentItem
    {
        public string Id { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public String Title { get; set; }
        public bool HasChildren { get; set; }
        public String Source { get; set; }
        public int Priref { get; set; } 
    }
}