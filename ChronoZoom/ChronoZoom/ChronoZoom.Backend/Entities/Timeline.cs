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
        public string Description { get; set; }
        public byte[] Timestamp { get; set; }
        public bool IsPublic { get; set; }
        public long RootContentItemId { get; set; }

        public ContentItem RootContentItem { get; set; }
        public string BackgroundUrl { get; set; }
    }
}