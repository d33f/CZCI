using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChronoZoom.API.Entities;

namespace ChronoZoom.API.Services
{
    public interface ITimelineService
    {
        Timeline FindTimeline(int id);
    }
}
