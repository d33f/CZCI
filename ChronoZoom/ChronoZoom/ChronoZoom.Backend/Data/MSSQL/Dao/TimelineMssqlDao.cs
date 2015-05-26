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
    public class TimelineMssqlDao : ITimelineDao
    {
        public Timeline Find(int id)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DBstring"].ConnectionString);
            con.Open();
            var query = "select * from timeline where Id=@id";
            var results = con.Query<Timeline>(query, new { id = id }).FirstOrDefault();
            con.Close();
            return results;
        }
    }
}