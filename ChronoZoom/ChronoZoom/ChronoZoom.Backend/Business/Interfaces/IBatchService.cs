using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface IBatchService
    {
        int ProcessFile(string filename);
    }
}
