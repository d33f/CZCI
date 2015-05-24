using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI.WebControls;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.OrientDb.Factory;
using ChronoZoom.Backend.Exceptions;
using Orient.Client;
using Orient.Client.API.Query;

namespace ChronoZoom.Backend.Data.OrientDb
{
    public class ContentItemDaoOrientDb : IContentItemDao
    {
        public IEnumerable<Entities.ContentItem> FindAll(string parentID)
        {
            using (var db = new ODatabase(OrientDb.DATABASE))
            {
                try
                {
                    string queryWithparam = "select * from contentitem where @rid in (select out('Contains') from ContentItem where @rid=#" + parentID + ")";

                    List<ContentItem> list = db.Query<ContentItem>(queryWithparam);
                    return ContentItemFactory.CreateList(parentID,list);
                }
                catch (Exception ex)
                {
                    throw new ContentItemNotFoundException();
                }
            }
        }

        public IEnumerable<Entities.ContentItem> FindAllForTimeline(string parentID)
        {
            using (var db = new ODatabase(OrientDb.DATABASE))
            {
                try
                {
                    string queryWithparam = "select * from contentitem where @rid in (select out('Contains') from TimeLine where @rid=#" + parentID + ")";

                    List<ContentItem> list = db.Query<ContentItem>(queryWithparam);
                    return ContentItemFactory.CreateList(parentID,list);
                }
                catch (Exception ex)
                {
                    throw new ContentItemNotFoundException();
                }
            }
        }
    }

}