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
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DBstring"].ConnectionString);
            con.Open();
            var query = "select * from contentitem where parentId=@parentId";
            var results = con.Query<ContentItem>(query,new {parentId = parentID});
            con.Close();
            return results;
        }

        public IEnumerable<ContentItem> FindAllForTimeline(int parentID)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DBstring"].ConnectionString);
            con.Open();
            var query = "select * from contentitem where timelineId=@timelineId";
            var results = con.Query<ContentItem>(query, new { timelineId = parentID });
            con.Close();
            return results;
        }
    }
}