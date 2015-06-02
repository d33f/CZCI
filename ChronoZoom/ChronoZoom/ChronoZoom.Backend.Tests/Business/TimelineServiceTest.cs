using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Business;
using Moq;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Exceptions;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ChronoZoom.Backend.Tests.Business
{
    [TestClass]
    public class TimelineServiceTest
    {
        [TestMethod]
        public void TimelineService_Get_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Find(It.IsAny<long>())).Returns(new Timeline()
            {
                Id = 1,
                Title = "1ste wereld oorlog",
                BeginDate = 1914M,
                EndDate = 1918M
            });
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            contentItemMock.Setup(setup => setup.FindAllForTimelineBy(It.IsAny<long>())).Returns(new ContentItem[2]);
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            Timeline result = target.Get(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual("1ste wereld oorlog", result.Title);
            Assert.AreEqual(1914M, result.BeginDate);
            Assert.AreEqual(1918M, result.EndDate);
            Assert.AreEqual(2, result.ContentItems.Length);
            mock.Verify(verify => verify.Find(It.IsAny<long>()), Times.Once);
            contentItemMock.Verify(verify => verify.FindAllForTimelineBy(result.Id), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(TimelineNotFoundException))]
        public void TimelineService_Get_NotFoundException_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Find(It.IsAny<long>())).Throws(new TimelineNotFoundException());
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            target.Get(-1);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void TimelineService_Get_Exception_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Find(It.IsAny<long>())).Throws(new Exception());
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            target.Get(1);
        }

        [TestMethod]
        public void TimelineService_GetAllPublicTimelinesWithoutContentItems_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.FindAllPublicTimelines()).Returns(new List<Timeline>()
            {
                new Timeline()
                {
                    Id = 1,
                    Title = "1ste wereld oorlog",
                    BeginDate = 1914M,
                    EndDate = 1918M,
                },
                new Timeline()
                {
                    Id = 2,
                    Title = "tweede wereldoorlog",
                    BeginDate = 1940M,
                    EndDate = 1945M
                }
            });
            TimelineService target = new TimelineService(mock.Object, null);

            // Act
            List<Timeline> result = target.GetAllPublicTimelinesWithoutContentItems().ToList();

            // Assert
            Assert.IsNotNull(result[0]);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual("1ste wereld oorlog", result[0].Title);
            Assert.AreEqual(1914M, result[0].BeginDate);
            Assert.AreEqual(1918M, result[0].EndDate);
            Assert.AreEqual(null, result[0].ContentItems);
            mock.Verify(verify => verify.FindAllPublicTimelines(), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void TimelineService_GetAllPublicTimelinesWithoutContentItems_Exception_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.FindAllPublicTimelines()).Throws(new Exception());
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            target.GetAllPublicTimelinesWithoutContentItems();
        }

        [TestMethod]
        public void TimelineService_Add_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<Timeline>()))
                .Callback((Timeline Timeline) => Timeline.Id = 123)
                .Returns((Timeline Timeline) => { return Timeline; });
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            Timeline result = target.Add(new Timeline()
            {
                Title = "1ste wereld oorlog",
                BeginDate = 1914M,
                EndDate = 1918M
            });

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(123, result.Id);
            Assert.AreEqual("1ste wereld oorlog", result.Title);
            Assert.AreEqual(1914M, result.BeginDate);
            Assert.AreEqual(1918M, result.EndDate);
            mock.Verify(verify => verify.Add(It.IsAny<Timeline>()), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void TimelineService_Add_DontCatchException_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<Timeline>())).Throws(new Exception());
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            target.Add(new Timeline());
        }

        [TestMethod]
        public void TimelineService_Update_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<Timeline>()));
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);
            Timeline timeline = new Timeline();

            // Act
            target.Update(timeline);
            mock.Verify(verify => verify.Update(timeline), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void TimelineService_Update_DontCatchException_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<Timeline>())).Throws(new Exception());
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            target.Update(new Timeline());
        }
    }
}
