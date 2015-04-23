using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoomImporter.EF
{
    public class DatabaseContext : DbContext
    {
        public DbSet<ContentItem> ContentItems { get; set; }
    }
}
