using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface ITimelineService
    {
        Timeline Get(string id);

        void Add(Timeline timeline);
    }
}