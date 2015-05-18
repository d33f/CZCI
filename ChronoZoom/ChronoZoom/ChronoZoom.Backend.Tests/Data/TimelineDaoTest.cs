//using System;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using ChronoZoom.Backend.Data;
//using System.Collections;
//using ChronoZoom.Backend.Entities;
//using System.Collections.Generic;

//namespace ChronoZoom.Backend.Tests.Data
//{
//    [TestClass]
//    public class TimelineDaoTest
//    {
//        [TestMethod]
//        public void ContentItemDao_FindAll_IntegrationTest()
//        {
//            // Arrange
//            TimelineDao target = new TimelineDao();

//            // Act
//            Timeline result = target.Find(1);

//            // Assert
//            Assert.IsNotNull(result);
//            Assert.AreEqual(1, result.Id);
//            Assert.AreEqual(8, result.ContentItems.Length);
//        }
//    }
//}
