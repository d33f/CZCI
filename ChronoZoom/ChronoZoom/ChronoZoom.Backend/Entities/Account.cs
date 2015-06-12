using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ChronoZoom.Backend.Entities
{
    public class Account : IPrincipal
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Screenname { get; set; }
        public bool IsInRole(string role)
        {
            return true;
        }

        public IIdentity Identity { get; private set; }
    }
}