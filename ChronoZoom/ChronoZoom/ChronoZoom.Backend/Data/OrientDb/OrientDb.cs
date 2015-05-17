using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using Orient.Client;

namespace ChronoZoom.Backend.Data.OrientDb
{
    public class OrientDb
    {
        private static readonly string HOST = "84.25.163.6";
        private static readonly int PORT = 2424;
        private static readonly string SERVERUSERNAME = "root";
        private static readonly string SERVERPASSWORD = "password";
        private static readonly string USERNAME = "chronozoom";
        private static readonly string PASSWORD = "password";
        public static readonly string DATABASE = "ChronoZoom";

        public static void Initialize()
        {
            OClient.CreateDatabasePool(HOST, PORT, DATABASE, ODatabaseType.Graph, USERNAME, PASSWORD, 10, DATABASE);
        }

        public static bool IsValidID(string parentId)
        {
            if (Regex.IsMatch(parentId, "^[0-9]+:[0-9]+"))
            {
                return true;
            }
            throw new FormatException("Id is not valid ORID");
        }
    }
}