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
using Dapper;
using Dapper.Exceptions;

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
            IEnumerable<ContentItem> result = target.FindAllBy(1034);

            // Assert
            Assert.AreEqual(51, result.Count());
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

        [TestMethod]
        public void ContentItemDao_Update_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                IContentItemDao target = new ContentItemDao();
                ContentItem contentItem;
                 
                using (DatabaseContext context = new DatabaseContext())
                {
                    contentItem = context.FirstOrDefault<Backend.Data.MSSQL.Entities.ContentItem, ContentItem>("SELECT * FROM [dbo].[ContentItem] WHERE Id=@Id", new { Id = 1 });
                }
                    
                // Act
                target.Update(contentItem);
            }
        }

        [TestMethod]
        [ExpectedException(typeof(UpdateFailedException))]
        public void ContentItemDao_Update_Exception_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                IContentItemDao target = new ContentItemDao();

                // Act
                target.Update(new ContentItem());
            }
        }

        [TestMethod]
        [ExpectedException(typeof(UpdateFailedException))]
        public void ContentItemDao_Update_TimestampChanged_IntegrationTest()
        {
            using (var scope = new TransactionScope())
            {
                // Arrange
                IContentItemDao target = new ContentItemDao();
                ContentItem contentItem;

                using (DatabaseContext context = new DatabaseContext())
                {
                    contentItem = context.FirstOrDefault<Backend.Data.MSSQL.Entities.ContentItem, ContentItem>("SELECT * FROM [dbo].[ContentItem] WHERE Id=@Id", new { Id = 1 });
                }
                contentItem.Timestamp[0]++;

                // Act
                target.Update(contentItem);
            }
        }
    }
}
