using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Business;
using Moq;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Exceptions;
using System.Collections.Generic;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Tests.Business
{
    [TestClass]
    public class BatchServiceTest
    {
        private static object lockObj = new object();
        private static long ID = 100;
        public static long GetNextID()
        {
            lock (lockObj)
            {
                return ++ID;
            }
        }

        [TestMethod]
        public void BatchService_ProcessFile_Test()
        {
            // Arrange
            Mock<IContentItemDao> contentItemDaoMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            contentItemDaoMock.Setup(setup => setup.Add(It.IsAny<ContentItem>()))
                .Callback((ContentItem contentItem) => contentItem.Id = BatchServiceTest.GetNextID())
                .Returns((ContentItem contentItem) => { return contentItem; });

            Mock<ITimelineDao> timelineDaoMock = new Mock<ITimelineDao>(MockBehavior.Strict);
            timelineDaoMock.Setup(setup => setup.Add(It.IsAny<Timeline>()))
                .Callback((Timeline timeline) => { timeline.Id = 10; timeline.RootContentItemId = 100; })
                .Returns((Timeline timeline) => { return timeline; });

            BatchService target = new BatchService(contentItemDaoMock.Object, timelineDaoMock.Object);

            //// Act
            //long result = target.ProcessFile("../../../batch.txt");
            
            //// Assert
            //Assert.AreEqual(10, result);
            //Assert.AreEqual((long)11210, ID);
        }
    }
}
