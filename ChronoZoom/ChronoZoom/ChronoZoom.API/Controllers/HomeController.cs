using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChronoZoom.API.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            // Added this line to test GitHub sync
            return View();
        }

        public ActionResult Test()
        {
            return View();
        }
    }
}