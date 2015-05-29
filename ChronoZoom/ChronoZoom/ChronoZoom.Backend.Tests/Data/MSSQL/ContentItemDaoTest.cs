using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Data;
using System.Collections;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.MSSQL.Dao;
using System.Transactions;

namespace ChronoZoom.Backend.Tests.Data.MSSQL
{
    [TestClass]
    public class ContentItemDaoTest
    {
        [TestMethod]
        public void ContentItemDao_FindAll_IntegrationTest()
        {
            // Arrange
            IContentItemDao target = new ContentItemDao();

            // Act
            IEnumerable<ContentItem> result = target.FindAllBy(3);

            // Assert
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public void ContentItemDao_FindAllForTimeline_IntegrationTest()
        {
            // Arrange
            IContentItemDao target = new ContentItemDao();

            // Act
            IEnumerable<ContentItem> result = target.FindAllForTimelineBy(18);

            // Assert
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public void ContentItemDao_Add_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                IContentItemDao target = new ContentItemDao();

                // Act
                ContentItem result = target.Add(new ContentItem()
                {
                    BeginDate = 1900,
                    EndDate = 2000,
                    Title = "Test",
                    ParentId = 1
                });

                // Assert
                Assert.IsTrue(result.Id != 0);
            }
        }
    }
}
