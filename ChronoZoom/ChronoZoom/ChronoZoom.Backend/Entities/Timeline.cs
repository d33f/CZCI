using System;
using System.Collections;

namespace ChronoZoom.Backend.Entities
{
    public class Timeline
    {
        public string Id { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Title { get; set; }
        public ContentItem[] ContentItems { get; set; }
    }
}