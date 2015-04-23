using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.API.Entities
{
    public class Timeline
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public ContentItem[] ContentItems { get; set; }
    }
}
