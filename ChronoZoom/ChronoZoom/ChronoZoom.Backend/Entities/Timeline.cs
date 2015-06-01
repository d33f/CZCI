using System.ComponentModel.DataAnnotations;

namespace ChronoZoom.Backend.Entities
{
    public class Timeline
    {
        public long Id { get; set; }
        [Required]
        public decimal? BeginDate { get; set; }
        [Required]
        public decimal? EndDate { get; set; }
        [Required]
        public string Title { get; set; }
        public ContentItem[] ContentItems { get; set; }
        public byte[] Timestamp { get; set; }
    }
}