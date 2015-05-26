using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orient.Client;

namespace ChronoZoom.Backend.Data.MSSQL.Entities
{
    public class Timeline
    {
        public int Id { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public string Title { get; set; }
    }
}