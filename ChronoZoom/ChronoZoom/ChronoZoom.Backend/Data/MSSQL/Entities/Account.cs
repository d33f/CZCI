using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Data.MSSQL.Entities
{
    public class Account
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Screenname { get; set; }
        public string Salt { get; set; }
        public string Hash { get; set; }
    }
}