using ChronoZoom.Backend.Controllers;
using System;
using System.Net.Http;
using System.Web;
using System.Web.Http.WebHost;

namespace ChronoZoom.Backend.App_Start
{
    public class NoBufferPolicySelector : WebHostBufferPolicySelector
    {
        public override bool UseBufferedInputStream(object hostContext)
        {
            var context = hostContext as HttpContextBase;

            if (context != null)
            {
                string batchController = typeof(BatchController).Name;
                batchController = batchController.Substring(0, batchController.LastIndexOf("Controller"));
                return context.Request.Path.StartsWith("/api/" + batchController, StringComparison.InvariantCultureIgnoreCase);
            }

            return true;
        }

        public override bool UseBufferedOutputStream(HttpResponseMessage response)
        {
            return base.UseBufferedOutputStream(response);
        }
    }
}
