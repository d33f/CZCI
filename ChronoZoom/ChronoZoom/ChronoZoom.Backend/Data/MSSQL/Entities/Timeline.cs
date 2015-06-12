using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.MSSQL.Entities
{
    public class Timeline
    {
        public long Id { get; set; }
        public long RootContentItemId { get; set; }
        public bool IsPublic { get; set; }
        public byte[] Timestamp { get; set; }
        public string BackgroundURL { get; set; }
    }
}