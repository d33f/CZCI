using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChronoZoom.API.Entities
{
    public class ContentItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Source { get; set; }
        public int Depth { get; set; }
        public bool HasChildren { get; set; }
    }
}
