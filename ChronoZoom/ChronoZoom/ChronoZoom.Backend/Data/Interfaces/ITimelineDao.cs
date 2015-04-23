using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface ITimelineDao
    {
        Backend.Entities.Timeline Find(int id);
    }
}