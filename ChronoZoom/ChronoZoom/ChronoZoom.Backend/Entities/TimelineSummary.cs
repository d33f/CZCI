using System.ComponentModel.DataAnnotations;

namespace ChronoZoom.Backend.Entities
{
    public class TimelineSummary
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}