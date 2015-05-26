using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Business;
using Moq;
using ChronoZoom.Backend.Data.Interfaces;
using ChronoZoom.Backend.Exceptions;

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
            mock.Setup(setup => setup.Find(It.IsAny<int>())).Returns(new Entities.Timeline()
            {
                Id = 1,
                Title = "1ste wereld oorlog",
                BeginDate = 1914M,
                EndDate = 1918M
            });
            TimelineService target = new TimelineService(mock.Object);

            // Act
            Entities.Timeline result = target.Get(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual("1ste wereld oorlog", result.Title);
            Assert.AreEqual(1914M, result.BeginDate);
            Assert.AreEqual(1918M, result.EndDate);
        }

        [TestMethod]
        [ExpectedException(typeof(TimelineNotFoundException))]
        public void TimelineService_GetNotFound_Test()
        {
            // Arrange
            Mock<ITimelineDao> mock = new Mock<ITimelineDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Find(It.IsAny<int>())).Throws(new TimelineNotFoundException());
            TimelineService target = new TimelineService(mock.Object);

            // Act
            target.Get(-1);
        }
    }
}
