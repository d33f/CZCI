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
                string query = "DECLARE @root HierarchyId = (SELECT Node FROM [dbo].[ContentItem] WHERE ID = 1);";
                query += "(SELECT * FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @root AND id = @id)";
                return context.FirstOrDefault<MSSQL.Entities.Timeline, Timeline>(query, new { id = id });
                //return context.FirstOrDefault<MSSQL.Entities.Timeline, Timeline>("select * from timeline where Id=@id", new { id = id });
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