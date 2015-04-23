using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Database;
using Moq;
using ChronoZoom.API.Services;
using System.Collections.Generic;
using System.Linq;

namespace ChronoZoom.API.Tests.Services
{
    [TestClass]
    public class TimelineServiceTest
    {
        [TestMethod]
        public void FindTimeline()
        {
            // Arrange
            Mock<ITimelineDatabase> mock = new Mock<ITimelineDatabase>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindTimeline(It.IsAny<int>())).Returns(new Database.Entities.Timeline()
            {
                Id = 1,
                Title = "Europese geschiendenis",
                BeginDate = -2000,
                EndDate = 2000,
                ContentItems = new List<Database.Entities.ContentItem>()
                {
                    new Database.Entities.ContentItem()
                    {
                        BeginDate = 2010,
                        EndDate = 2011,
                        Title = "CI1",
                        Depth = 0,
                        HasChildren = true,
                        Id = 1,
                        Source = "test source"
                    },
                    new Database.Entities.ContentItem()
                    {
                        BeginDate = 2011,
                        EndDate = 2012,
                        Title = "CI2",
                        Depth = 1,
                        HasChildren = false,
                        Id = 2,
                        Source = "test source2"
                    }
                }
            });
            TimelineService target = new TimelineService(mock.Object);

            // Act
            API.Entities.Timeline result = target.FindTimeline(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Id);
            Assert.AreEqual(2, result.ContentItems.Length);
            Assert.AreEqual(1, result.ContentItems[0].Id);
            Assert.AreEqual(true, result.ContentItems[0].HasChildren);
            Assert.AreEqual(2, result.ContentItems[1].Id);
            Assert.AreEqual(false, result.ContentItems[1].HasChildren);
            Assert.AreEqual("Europese geschiendenis", result.Title);
            Assert.AreEqual(-2000, result.BeginDate);
            Assert.AreEqual(2000, result.EndDate);
            mock.Verify(verify => verify.FindTimeline(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }

        [TestMethod]
        public void GetTimelines()
        {
            // Arrange
            Mock<ITimelineDatabase> mock = new Mock<ITimelineDatabase>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.List()).Returns(new List<Database.Entities.Timeline>()
            {
                new Database.Entities.Timeline()
                {
                Id = 1,
                Title = "Europese geschiendenis",
                BeginDate = -2000,
                EndDate = 2000,
                ContentItems = new List<Database.Entities.ContentItem>()
                {
                    new Database.Entities.ContentItem()
                    {
                        BeginDate = 2010,
                        EndDate = 2011,
                        Title = "CI1",
                        Depth = 0,
                        HasChildren = true,
                        Id = 1,
                        Source = "test source"
                    },
                    new Database.Entities.ContentItem()
                    {
                        BeginDate = 2011,
                        EndDate = 2012,
                        Title = "CI2",
                        Depth = 1,
                        HasChildren = false,
                        Id = 2,
                        Source = "test source2"
                    }
                }
                }
            });
            TimelineService target = new TimelineService(mock.Object);

            // Act
            List<API.Entities.Timeline> result = target.GetTimelines().ToList();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual(-2000, result[0].BeginDate);
            Assert.AreEqual(2, result[0].ContentItems.Length);
            mock.Verify(verify => verify.List(), Times.Once); // Verify that method is called and that it is called only once!
        }
    }
}
