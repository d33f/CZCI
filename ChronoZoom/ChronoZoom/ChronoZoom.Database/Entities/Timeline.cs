using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database.Entities
{
    public class Timeline
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        public IEnumerable<ContentItem> ContentItems { get; set; }

        public Timeline(int Id, string Title, decimal BeginDate, decimal EndDate, ContentItem[] ContentItems)
        {
            this.Id = Id;
            this.Title = Title;
            this.BeginDate = BeginDate;
            this.EndDate = EndDate;
            this.ContentItems = ContentItems;
        }

        public Timeline(DBEntities.Timeline Timeline, IEnumerable<ContentItem> ContentItems)
        {
            this.Id = Timeline.Id;
            this.Title = Timeline.Title;
            this.BeginDate = Timeline.BeginDate;
            this.EndDate = Timeline.EndDate;
            this.ContentItems = ContentItems;
        }

        public Timeline()
        {
            // TODO: Complete member initialization
        }
    }
}
