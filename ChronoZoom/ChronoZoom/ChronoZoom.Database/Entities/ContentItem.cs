using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database.Entities
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

        public ContentItem(ContentItem ContentItem)
        {
            this.Id = ContentItem.Id;
            this.Title = ContentItem.Title;
            this.BeginDate = ContentItem.BeginDate;
            this.EndDate = ContentItem.EndDate;
            this.Source = ContentItem.Source;
            this.Depth = ContentItem.Depth;
            this.HasChildren = ContentItem.HasChildren;
        }

        public ContentItem(int Id, string Title, decimal BeginDate, decimal EndDate, string Source, int Depth, bool HasChildren)
        {
            this.Id = Id;
            this.Title = Title;
            this.BeginDate = BeginDate;
            this.EndDate = EndDate;
            this.Source = Source;
            this.Depth = Depth;
            this.HasChildren = HasChildren;
        }

        public ContentItem()
        {
            // TODO: Complete member initialization
        }
    }
}
