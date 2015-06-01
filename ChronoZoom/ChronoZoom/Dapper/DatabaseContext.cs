using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Reflection;
using System.Data;
using Dapper.Exceptions;

namespace Dapper
{
    public class DatabaseContext : IDisposable
    {
        private SqlConnection _connection;

        public DatabaseContext()
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

            return MapEntity<TDataEntity, TEntity>(dataEntityProperties, entityProperties, result);
        }

        public IEnumerable<TEntity> Select<TDataEntity, TEntity>(string query, object param = null) where TEntity : new()
        {
            IEnumerable<TDataEntity> results = _connection.Query<TDataEntity>(query, param);

            return MapEntities<TDataEntity, TEntity>(results);
        }

        public TEntity Add<TDataEntity, TEntity>(TEntity entity, string[] skipColumns = null) where TDataEntity : new()
        {
            if (skipColumns == null)
            {
                skipColumns = new string[] { "Id", "ID" };
            }

            PropertyInfo[] destinationEntityProperties = typeof(TDataEntity).GetProperties();
            
            string tableName = typeof(TDataEntity).Name;
            string[] columns = destinationEntityProperties.Select(property => property.Name).Where(w => !skipColumns.Contains(w)).ToArray();
            string query = "INSERT INTO " + tableName + " (" + String.Join(",", columns) + ")Values(" + String.Join(",", columns.Select(x => x = "@" + x)) + ")";

            return Add<TDataEntity, TEntity>(query, entity);
        }

        public TEntity Add<TDataEntity, TEntity>(string query, TEntity entity) where TDataEntity : new()
        {
            PropertyInfo[] destinationEntityProperties = typeof(TDataEntity).GetProperties();
            PropertyInfo[] sourceEntityProperties = typeof(TEntity).GetProperties();

            TDataEntity dataEntity = MapEntity<TEntity, TDataEntity>(sourceEntityProperties, destinationEntityProperties, entity);
            query += (query.EndsWith(";") ? "" : ";") + "SELECT CAST(SCOPE_IDENTITY() as int)";
            IEnumerable<int> results = _connection.Query<int>(query, dataEntity);

            return UpdateEntityIdentity<TEntity>(entity, sourceEntityProperties, results.First());
        }

        private TEntity UpdateEntityIdentity<TEntity>(TEntity entity, PropertyInfo[] entityProperties, int id)
        {
            PropertyInfo entityProperty = entityProperties.FirstOrDefault(p => String.Equals(p.Name, "ID", StringComparison.OrdinalIgnoreCase));
            if (entityProperty != null)
            {
                entityProperty.SetValue(entity, id);
            }
            return entity;
        }

        public TEntity AddContentItem<TDataEntity, TEntity>(TEntity entity) where TDataEntity : new()
        {
            PropertyInfo[] sourceEntityProperties = typeof(TEntity).GetProperties();
            PropertyInfo[] destinationEntityProperties = typeof(TDataEntity).GetProperties();
            TDataEntity dataEntity = MapEntity<TEntity, TDataEntity>(sourceEntityProperties, destinationEntityProperties, entity);

            DynamicParameters parameters = CreateDynamicParameters<TDataEntity>(dataEntity, destinationEntityProperties.Where(p => !String.Equals(p.Name, "ID", StringComparison.OrdinalIgnoreCase) && !String.Equals(p.Name, "Timestamp", StringComparison.OrdinalIgnoreCase)).ToArray());

            parameters.Add("@insertedID", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("@return_value", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);

            _connection.Execute("spAddContentItem", parameters, commandType: CommandType.StoredProcedure);
            int id = parameters.Get<int>("@insertedID");

            return UpdateEntityIdentity<TEntity>(entity,  typeof(TEntity).GetProperties(), id);
        }

        public void Update<TDataEntity, TEntity>(TEntity entity, string[] whereColumns) where TDataEntity : new()
        {
            PropertyInfo[] destinationEntityProperties = typeof(TDataEntity).GetProperties();
            PropertyInfo[] sourceEntityProperties = typeof(TEntity).GetProperties();

            TDataEntity dataEntity = MapEntity<TEntity, TDataEntity>(sourceEntityProperties, destinationEntityProperties, entity);

            string tableName = typeof(TDataEntity).Name;

            string[] columns = destinationEntityProperties.Select(property => property.Name).Where(w => !whereColumns.Contains(w)).ToArray();
            string query = "UPDATE " + tableName + " SET " + String.Join(",", columns.Select(x => x + " = @" + x)) + " WHERE " + String.Join(" AND ", whereColumns.Select(x => x + " = @" + x));
            if (_connection.Execute(query, dataEntity) != 1)
            {
                throw new UpdateFailedException();
            }
        }

        private DynamicParameters CreateDynamicParameters<TDataEntity>(TDataEntity entity, PropertyInfo[] destinationEntityProperties)
        {
            DynamicParameters parameters = new DynamicParameters();

            foreach (PropertyInfo destinationEntityProperty in destinationEntityProperties)
            {
                parameters.Add(destinationEntityProperty.Name, destinationEntityProperty.GetValue(entity));
            }

            return parameters;
        }

        private IEnumerable<TDestinationEntity> MapEntities<TSourceEntity, TDestinationEntity>(IEnumerable<TSourceEntity> results) where TDestinationEntity : new()
        {
            List<Task> tasks = new List<Task>(results.Count());
            ConcurrentBag<TDestinationEntity> entities = new ConcurrentBag<TDestinationEntity>();
            PropertyInfo[] sourceEntityProperties = typeof(TSourceEntity).GetProperties();
            PropertyInfo[] destinationEntityProperties = typeof(TDestinationEntity).GetProperties();

            foreach (TSourceEntity result in results)
            {
                tasks.Add(Task.Factory.StartNew(() => entities.Add(MapEntity<TSourceEntity, TDestinationEntity>(sourceEntityProperties, destinationEntityProperties, result))));
            }

            Task.WaitAll(tasks.ToArray());
            return entities;
        }

        private TDestinationEntity MapEntity<TSourceEntity, TDestinationEntity>(PropertyInfo[] sourceEntityProperties, PropertyInfo[] destinationEntityProperties, TSourceEntity data) where TDestinationEntity : new()
        {
            TDestinationEntity entity = new TDestinationEntity();

            foreach (PropertyInfo sourceEntityProperty in sourceEntityProperties)
            {
                PropertyInfo entityProperty = destinationEntityProperties.FirstOrDefault(p => p.Name == sourceEntityProperty.Name && p.PropertyType.IsAssignableFrom(sourceEntityProperty.PropertyType));
                if (entityProperty != null)
                {
                    Object value = sourceEntityProperty.GetValue(data);
                    entityProperty.SetValue(entity, value);
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