using System;
using System.ComponentModel.DataAnnotations;

namespace ChronoZoom.Backend.Entities
{
    public class ContentItem
    {
        public int Id { get; set; }
        [Required]
        public decimal? BeginDate { get; set; }
        [Required]
        public decimal? EndDate { get; set; }
        [Required]
        public string Title { get; set; }
        public bool HasChildren { get; set; }
        public String Source { get; set; }
        public int Priref { get; set; }
        [Required]
        public int ParentId { get; set; }
    }
}