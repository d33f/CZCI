﻿using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Data;
using System.Collections;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Data.MSSQL.Dao;

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
    }
}