using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace ChronoZoom.Frontend
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/js/canvas").Include(
            "~/Libraries/JQuery/jquery-1.11.3.min.js",
            "~/Scripts/Canvas/Settings.js",
            "~/Scripts/Canvas/BackendService.js",
            "~/Scripts/Canvas/PublicAPIService.js",
            "~/Scripts/Canvas/ContentItemService.js",
            "~/Scripts/Canvas/ContentItemEnricher.js",
            "~/Scripts/Canvas/Breadcrumbs.js",
            "~/Scripts/Canvas/Timeline.js",
            "~/Scripts/Canvas/Yearmarker.js",
            "~/Scripts/Canvas/Timescale.js",
            "~/Scripts/Canvas/ContentItem.js",
            "~/Scripts/Canvas/Mousepointer.js",
            "~/Scripts/Canvas/Canvas.js",
            "~/Libraries/Tooltip/tooltip.js"
            )); 

            bundles.Add(new StyleBundle("~/bundles/css").Include(
            "~/Styles/Reset.min.css",
            "~/Styles/Style.css",
            "~/Libraries/Tooltip/tooltip.css"));
        }
    }
}