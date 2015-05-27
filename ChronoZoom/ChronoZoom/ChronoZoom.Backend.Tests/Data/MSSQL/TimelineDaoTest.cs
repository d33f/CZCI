using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Data;
using System.Collections;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;
using ChronoZoom.Backend.Data.MSSQL.Dao;
using ChronoZoom.Backend.Data.Interfaces;

namespace ChronoZoom.Backend.Tests.Data.MSSQL
{
    [TestClass]
    public class TimelineDaoTest
    {
        [TestMethod]
        public void TimelineDao_FindAll_IntegrationTest()
        {
            // Arrange
            ITimelineDao target = new TimelineDao();

            // Act
            Timeline result = target.Find(18);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(18, result.Id);
        }

        [TestMethod]
        public void TimelineDao_FindAll_Null_IntegrationTest()
        {
            // Arrange
            ITimelineDao target = new TimelineDao();

            // Act
            Timeline result = target.Find(-1);

            // Assert
            Assert.IsNull(result);
        }
    }
}
