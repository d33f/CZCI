using System;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.MSSQL.Entities;
using Dapper;

namespace ChronoZoom.Backend.Data.MSSQL.Dao
{
    public class AccountDao : IAccountDao
    {

        public bool Register(string email, string screenname,string salt, string hash)
        {
            using(var context = new DatabaseContext())
            {
                const string query = "Insert into Account(email,screenname,hash,salt) values(@email,@screenname,@hash,@salt); select @@rowcount";
                return context.SingleOrDefault<int>(query, new {email, screenname, hash, salt}) > 0;
            }
        }

        public Account GetMember(string email)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "Select * from Account where email=@email";
                return context.SingleOrDefault<Account>(query, new {email});
            }
        }

        public bool CreateSession(string token, DateTime timestamp, long accountId)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "insert into session(token,timestamp,accountid) values(@token,@timestamp,@accountid); select @@rowcount";
                return context.SingleOrDefault<int>(query, new {token, timestamp,accountId}) > 0;
            }
        }

        public Session GetSession(string token)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "Select Token as TokenString, Timestamp from Session where token=@token";
                return context.SingleOrDefault<Session>(query, new { token });
            }
        }

        public bool RemoveSession(string token)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "delete from session where token = @token; select @@rowcount";
                var rowcount = context.SingleOrDefault<int>(query, new { token = token });
                return rowcount > 0;
            }
        }

        public bool RemoveSession(long accountId)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "delete from session where accountId = @id; select @@rowcount";
                var rowcount = context.SingleOrDefault<int>(query, new { id = accountId });
                return rowcount > 0;
            }
        }

        public bool UpdateSessionTime(string token, DateTime newTime)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "Update session set timestamp =@timestamp where token = @token; select @@rowcount";
                return context.SingleOrDefault<int>(query, new {token, newTime}) > 0;
            }
        }

        public bool EmailExists(string email)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "Select count(*) as found from account where email=@email";
                return context.SingleOrDefault<int>(query, new {email}) > 0;
            }
        }

        public bool ScreennameExists(string screenname)
        {
            using (var context = new DatabaseContext())
            {
                const string query = "Select count(*) as found from account where screenname=@screenname";
                return context.SingleOrDefault<int>(query, new { screenname }) > 0;
            }
        }
    }
}