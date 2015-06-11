using System;
using ChronoZoom.Backend.Data.MSSQL.Entities;

namespace ChronoZoom.Backend.Data.Interfaces
{
    public interface IAccountDao
    {
        bool Register(string email, string screenname, string salt,string hash);
        Account GetMember(string email);
        bool CreateSession(string token, DateTime timestamp);
        Session GetSession(string token);
        bool RemoveSession(string token);
        bool UpdateSessionTime(string token, DateTime newTime);
    }
}