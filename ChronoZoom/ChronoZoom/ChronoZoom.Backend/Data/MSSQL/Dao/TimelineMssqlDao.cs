using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Dapper;
using ChronoZoom.Backend.Exceptions;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class TimelineMssqlDao : ITimelineDao
    {
        public Timeline Find(int id)
        {
            using (DapperQuery query = new DapperQuery())
            {
                return query.FirstOrDefault<MSSQL.Entities.Timeline, Timeline>("select * from timeline where Id=@id", new { id = id });
            }
        }
    }
}