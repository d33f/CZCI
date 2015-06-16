using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.MSSQL.Entities
{
    public class TimelineJoinContentItem
    {
        public long Id { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public byte[] Timestamp { get; set; }
        public bool IsPublic { get; set; }
        public long RootContentItemId { get; set; }
        public string BackgroundUrl { get; set; }
    }
}