using System;

namespace ChronoZoom.Backend.Entities
{
    public class ContentItem
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public String Title { get; set; }
        public int Depth { get; set; }
        public bool HasChildren { get; set; }
        public String Source { get; set; }
    }
}