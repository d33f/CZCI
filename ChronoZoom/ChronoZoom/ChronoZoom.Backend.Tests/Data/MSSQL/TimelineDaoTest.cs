using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Data;
using System.Collections;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;
using ChronoZoom.Backend.Data.MSSQL.Dao;
using ChronoZoom.Backend.Data.Interfaces;
using System.Transactions;
using Dapper;
using Dapper.Exceptions;

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

        [TestMethod]
        public void TimelineDao_Add_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                ITimelineDao target = new TimelineDao();

                // Act
                Timeline result = target.Add(new Timeline()
                {
                    BeginDate = 1900,
                    EndDate = 2000,
                    Title = "Test"
                });

                // Assert
                Assert.IsTrue(result.Id != 0);
            }
        }

        [TestMethod]
        public void TimelineDao_Update_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                ITimelineDao target = new TimelineDao();
                Timeline timeline;

                using (DatabaseContext context = new DatabaseContext())
                {
                    timeline = context.FirstOrDefault<Backend.Data.MSSQL.Entities.ContentItem, Timeline>("SELECT * FROM [dbo].[ContentItem] WHERE Id=@Id", new { Id = 1 });
                }

                // Act
                target.Update(timeline);
            }
        }

        [TestMethod]
        [ExpectedException(typeof(UpdateFailedException))]
        public void TimelineDao_Update_Exception_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                ITimelineDao target = new TimelineDao();

                // Act
                target.Update(new Timeline());
            }
        }

        [TestMethod]
        [ExpectedException(typeof(UpdateFailedException))]
        public void TimelineDao_Update_TimestampChanged_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                ITimelineDao target = new TimelineDao();
                Timeline Timeline;

                using (DatabaseContext context = new DatabaseContext())
                {
                    Timeline = context.FirstOrDefault<Backend.Data.MSSQL.Entities.ContentItem, Timeline>("SELECT * FROM [dbo].[ContentItem] WHERE Id=@Id", new { Id = 1 });
                }
                Timeline.Timestamp[0]++;

                // Act
                target.Update(Timeline);
            }
        }
    }
}