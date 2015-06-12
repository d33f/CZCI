using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Web;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.MSSQL.Entities;
using ChronoZoom.Backend.Exceptions;
using Account = ChronoZoom.Backend.Entities.Account;

namespace ChronoZoom.Backend.Business
{
    public class AccountService : IAccountService
    {
        private readonly IAccountDao _accountDao;

        public AccountService(IAccountDao accountDao)
        {
            _accountDao = accountDao;
        }

        public Guid Login(string email, string password)
        {
            Guid guid = Guid.Empty;
            var member = _accountDao.GetAccountByEmail(email);
            if (member == null) throw new LoginFailedException();
            //TODO : CHECK IF MEMBER EXISTS AND NOT IS NULL
            if (Verify(member.Salt, member.Hash, password))
            {
                _accountDao.RemoveSession(member.Id); //Remove all old sessions from this user
                guid = CreateSession(member.Id);
            }

            return guid;
        }

        private Guid CreateSession(long accountId)
        {
            var guid = Guid.NewGuid();
            var session = _accountDao.CreateSession(guid.ToString(), DateTime.UtcNow,accountId);
            return guid;
        }

        public bool Register(string email, string password, string screenname)
        {
            if (_accountDao.EmailExists(email) || _accountDao.ScreennameExists(screenname)) throw new AlreadyExistsException();
            var salt = GenerateSalt(40);
            var hash = GenerateHash(salt, password);
            return _accountDao.Register(email, screenname, salt, hash);
        }

        public bool Logout(string token)
        {
            return _accountDao.RemoveSession(token);
        }


        /// <summary>
        /// Generates a passwordhash based on the given salt and password
        /// </summary>
        /// <param name="salt"></param>
        /// <param name="password"></param>
        /// <returns>Password hash made with a salt</returns>
        private string GenerateHash(string salt, string password)
        {
            HashAlgorithm alg = new SHA256CryptoServiceProvider();
            // Convert the data to hash to an array of Bytes.
            byte[] bytValue = Encoding.UTF8.GetBytes(salt + password);
            // Compute the Hash. This returns an array of Bytes.
            byte[] bytHash = alg.ComputeHash(bytValue);
            // Optionally, represent the hash value as a base64-encoded string, 
            // For example, if you need to display the value or transmit it over a network.
            return Convert.ToBase64String(bytHash);
        }

        private bool Verify(string userSalt, string userHash, string loginPassword)
        {
            var hash = GenerateHash(userSalt, loginPassword);
            return hash == userHash;
        }

        private string GenerateSalt(int size)
        {
            var provider = new RNGCryptoServiceProvider();
            var buff = new byte[size];
            provider.GetBytes(buff);
            return Convert.ToBase64String(buff);
        }

        public bool IsTokenValid(string token)
        {
            Session session = _accountDao.GetSession(token);
            if (session == null) return false;
            TimeSpan span = DateTime.UtcNow - session.Timestamp;
            if (span.Minutes > 20)
            {
                _accountDao.RemoveSession(token);
                return false;
            }
            Guid guid;
            var parsed = Guid.TryParse(token, out guid);
            if (!parsed) return false;
            _accountDao.UpdateSessionTime(token,DateTime.UtcNow);
            return true;
        }

        public Account GetAccountByToken(string sessiontoken)
        {
            var accountByToken = _accountDao.GetAccountByToken(sessiontoken);
            Account acc = new Account
            {
                Email = accountByToken.Email,
                Id = accountByToken.Id,
                Screenname = accountByToken.Screenname
            };
            return acc;
        }
    }
}