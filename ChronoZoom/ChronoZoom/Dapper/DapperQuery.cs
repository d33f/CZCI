using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Reflection;

namespace Dapper
{
    public class DapperQuery : IDisposable
    {
        private SqlConnection _connection;

        public DapperQuery()
        {
            _connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DBstring"].ConnectionString);
            _connection.Open();
        }

        public TEntity FirstOrDefault<TDataEntity, TEntity>(string query, object param = null) where TEntity : new()
        {
            var results = _connection.Query<TDataEntity>(query, param);
            var result = results.FirstOrDefault();
            if (result == null)
            {
                return default(TEntity);
            }

            PropertyInfo[] dataEntityProperties = typeof(TDataEntity).GetProperties();
            PropertyInfo[] entityProperties = typeof(TEntity).GetProperties();

            return ProcessResult<TDataEntity, TEntity>(dataEntityProperties, entityProperties, result);
        }

        public IEnumerable<TEntity> Select<TDataEntity, TEntity>(string query, object param = null) where TEntity : new()
        {
            var results = _connection.Query<TDataEntity>(query, param);

            return ProcessResults<TDataEntity, TEntity>(results);
        }

        private IEnumerable<TEntity> ProcessResults<TDataEntity, TEntity>(IEnumerable<TDataEntity> results) where TEntity : new()
        {
            List<Task> tasks = new List<Task>(results.Count());
            ConcurrentBag<TEntity> entities = new ConcurrentBag<TEntity>();
            PropertyInfo[] dataEntityProperties = typeof(TDataEntity).GetProperties();
            PropertyInfo[] entityProperties = typeof(TEntity).GetProperties();

            foreach (TDataEntity result in results)
            {
                tasks.Add(Task.Factory.StartNew(() => entities.Add(ProcessResult<TDataEntity, TEntity>(dataEntityProperties, entityProperties, result))));
            }

            Task.WaitAll(tasks.ToArray());
            return entities;
        }

        private TEntity ProcessResult<TDataEntity, TEntity>(PropertyInfo[] dataEntityProperties, PropertyInfo[] entityProperties, TDataEntity data) where TEntity : new()
        {
            TEntity entity = new TEntity();

            foreach (PropertyInfo dataEntityProperty in dataEntityProperties)
            {
                PropertyInfo entityPropertie = entityProperties.FirstOrDefault(p => p.Name == dataEntityProperty.Name && p.PropertyType.IsAssignableFrom(dataEntityProperty.PropertyType));
                if (entityPropertie != null)
                {
                    Object value = dataEntityProperty.GetValue(data);
                    entityPropertie.SetValue(entity, value);
                }
            }

            return entity;
        }

        public void Dispose()
        {
            _connection.Close();
        }
    }
}