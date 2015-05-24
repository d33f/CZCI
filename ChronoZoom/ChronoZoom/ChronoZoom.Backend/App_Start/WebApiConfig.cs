using System.Web.Http;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http.Cors;

namespace ChronoZoom.Backend
{
    [ExcludeFromCodeCoverage]
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Enable cross-origin-requests
            var cors = new EnableCorsAttribute("http://localhost:20000", "*", "GET");
            config.EnableCors(cors);
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
