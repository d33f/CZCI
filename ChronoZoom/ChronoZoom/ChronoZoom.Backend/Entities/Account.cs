using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ChronoZoom.Backend.Entities
{
    public class Account
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Screenname { get; set; }
    }
}