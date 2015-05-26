using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Dapper;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class ContentItemMssqlDao : IContentItemDao
    {
        public IEnumerable<ContentItem> FindAll(int parentID)
        {
            using (DapperQuery query = new DapperQuery())
            {
                return query.Select<MSSQL.Entities.ContentItem, ContentItem>("select * from contentitem where parentId=@parentId",new {parentId = parentID});
            }
        }

        public IEnumerable<ContentItem> FindAllForTimeline(int parentID)
        {
            using (DapperQuery query = new DapperQuery())
            {
                return query.Select<MSSQL.Entities.ContentItem, ContentItem>("select * from contentitem where timelineId=@timelineId", new { timelineId = parentID });
            }
        }
    }
}