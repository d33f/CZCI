using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http.Hosting;
using ChronoZoom.Backend.App_Start;

namespace ChronoZoom.Backend
{
    [ExcludeFromCodeCoverage]
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            GlobalConfiguration.Configuration.Services.Replace(typeof(IHostBufferPolicySelector), new NoBufferPolicySelector());

            GlobalConfiguration.Configuration.Formatters.Clear();
            GlobalConfiguration.Configuration.Formatters.Add(new JsonMediaTypeFormatter());
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

           /* if (Context.Request.Path.Contains("api/") && Context.Request.HttpMethod == "OPTIONS")
            {
                Context.Response.AddHeader("Access-Control-Allow-Origin", Context.Request.Headers["Origin"]);
                Context.Response.AddHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                Context.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST PUT, DELETE, OPTIONS");
                // This line is added because whatever is coming from the Register " { SupportsCredentials = true };" is ignored.
                Context.Response.AddHeader("Access-Control-Allow-Credentials", "true");
                Context.Response.End();
            }*/

        } 
    }
}
