using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Data;
using System.Collections;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Tests.Data
{
    [TestClass]
    public class ContentItemDaoTest
    {
        [TestMethod]
        public void ContentItemDao_FindAll_IntegrationTest()
        {
            // Arrange
            ContentItemDao target = new ContentItemDao();

            // Act
            IEnumerable<ContentItem> result = target.FindAll(1);

            // Assert
            Assert.AreEqual(-1, result); // geen idee hoeveel resultaten?! TODO : add data!!
        }
    }
}
