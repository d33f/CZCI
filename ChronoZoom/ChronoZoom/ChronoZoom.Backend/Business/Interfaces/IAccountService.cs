using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Business.Interfaces
{
    public interface IAccountService
    {
        Guid Login(string email, string password);
        bool Register(string email, string password, string screenname);
        bool Logout(string token);
        bool IsTokenValid(string first);
        Account GetAccountByToken(string sessiontoken);
    }
}
