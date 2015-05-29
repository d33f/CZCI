using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Entities;
using Dapper;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class TimelineDao : ITimelineDao
    {
        public Timeline Find(int id)
        {
            using (DatabaseContext context = new DatabaseContext())
            {
                return context.FirstOrDefault<MSSQL.Entities.Timeline, Timeline>("select * from timeline where Id=@id", new { id = id });
            }
        }

        public Timeline Add(Timeline timeline)
        {
            throw new System.NotImplementedException();
        }

        public void Update(Timeline timeline)
        {
            throw new System.NotImplementedException();
        }
    }
}