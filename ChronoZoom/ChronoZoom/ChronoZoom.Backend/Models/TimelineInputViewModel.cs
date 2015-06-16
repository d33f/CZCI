using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Models
{
    public class TimelineInputViewModel
    {
        public string Title { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Description { get; set; }
    }
}