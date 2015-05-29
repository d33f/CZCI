using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.MSSQL.Entities
{
    public class ContentItem
    {
        public long Id { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Title { get; set; }
        public bool HasChildren { get; set; }
        public string PictureURL { get; set; }
        public long ParentId { get; set; }
        public string SourceURL { get; set; }
        public string SourceRef { get; set; }
    }
}