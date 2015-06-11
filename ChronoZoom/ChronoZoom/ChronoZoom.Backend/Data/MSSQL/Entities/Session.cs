using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.MSSQL.Entities
{
    public class Session
    {
        public Guid Token { get; set; }
        public DateTime Timestamp { get; set; }

        public string TokenString {
            get { return Token.ToString("N"); }
            set { Token = new Guid(value); }
        }
    }
}