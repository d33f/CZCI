using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database.DBEntities
{
    public class Timeline
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal BeginDate { get; set; }
        public decimal EndDate { get; set; }
        
        public Timeline(int Id, string Title, decimal BeginDate, decimal EndDate)
        {
            this.Id = Id;
            this.Title = Title;
            this.BeginDate = BeginDate;
            this.EndDate = EndDate;
        }

        public Timeline() { }
    }
}
