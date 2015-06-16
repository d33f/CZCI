using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Business;
using Moq;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Exceptions;
using ChronoZoom.Backend.Entities;
using System.Collections.Generic;


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
                RootContentItemId = 123,
                Title = "1ste wereld oorlog",
                BeginDate = 1914M,
                EndDate = 1918M
            });
            Mock<IContentItemDao> contentItemMock = new Mock<IContentItemDao>(MockBehavior.Strict);
            contentItemMock.Setup(setup => setup.Find(It.IsAny<long>(), It.IsAny<int>())).Returns(new ContentItem()
            {
                Children = new ContentItem[2]
            });
            TimelineService target = new TimelineService(mock.Object, contentItemMock.Object);

            // Act
            Timeline result = target.Get(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual((long)1, result.Id);
            Assert.AreEqual("1ste wereld oorlog", result.Title);
            Assert.AreEqual(1914M, result.BeginDate);
            Assert.AreEqual(1918M, result.EndDate);
            Assert.IsNotNull(result.RootContentItem);
            Assert.AreEqual(2, result.RootContentItem.Children.Count());
            mock.Verify(verify => verify.Find(It.IsAny<long>()), Times.Once);
            contentItemMock.Verify(verify => verify.Find(result.RootContentItemId, It.IsAny<int>()), Times.Once);
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
            mock.Setup(setup => setup.FindAllPublicTimelines()).Returns(new TimelineSummary[]
            {
                new TimelineSummary()
                {
                    Id = 1,
                    Title = "1ste wereld oorlog",
                    Description = "Test"
                },
                new TimelineSummary()
            });
            TimelineService target = new TimelineService(mock.Object, null);

            // Act
            IEnumerable<TimelineSummary> result = target.GetAllTimelineSummariesForPublicTimelines();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            TimelineSummary firstResult = result.First();
            Assert.AreEqual((long)1, firstResult.Id);
            Assert.AreEqual("1ste wereld oorlog", firstResult.Title);
            Assert.AreEqual("Test", firstResult.Description);
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
            target.GetAllTimelineSummariesForPublicTimelines();
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
