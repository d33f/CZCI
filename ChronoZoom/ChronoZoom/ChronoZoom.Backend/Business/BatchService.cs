using ChronoZoom.Backend.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace ChronoZoom.Backend.Business
{
    public class BatchService : IBatchService
    {
        public int ProcessFile(string filename)
        {
            using (FileStream fileStream = File.OpenRead(filename))
            {
                using (StreamReader streamReader = new StreamReader(fileStream, Encoding.UTF8, true, 128)) 
                {
                    string line = streamReader.ReadLine(); // the timeline

                    while ((line = streamReader.ReadLine()) != null)
                    {
                        // all the content items
                    }

                    return -1;
                }
            }
        }
    }
}