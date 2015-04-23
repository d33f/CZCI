using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.API;
using ChronoZoom.API.Controllers;
using ChronoZoom.API.Services;
using Moq;
using ChronoZoom.API.Entities;

namespace ChronoZoom.API.Tests.Controllers
{
    [TestClass]
    public class TimelineControllerTest
    {
        /// <summary>
        /// Mock and retrieve a list of all the timelines
        /// </summary>
        [TestMethod]
        public void GetTimelineWithoutId()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindTimeline(It.IsAny<int>())).Returns(new Timeline()
            {
                Title = "Europese geschiendenis",
                ContentItems = new ContentItem[]
                {
                    new ContentItem() { Title = "Contentitem 1 inside timeline "},
                    new ContentItem() { Title = "Contentitem 2 inside timeline "}
                }
            });
            TimelineController target = new TimelineController(mock.Object);

            // Act
            Timeline result = target.Get();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Europese geschiendenis", result.Title);
            Assert.AreEqual(2, result.ContentItems.Count());
            mock.Verify(verify => verify.FindTimeline(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }


        /// <summary>
        /// Mock and retrieve a list of all the timelines
        /// </summary>
        [TestMethod]
        public void GetTimelineWithId()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindTimeline(It.IsAny<int>())).Returns(new Timeline()
            {
                Title = "Europese geschiendenis",
                ContentItems = new ContentItem[]
                {
                    new ContentItem() { Title = "Contentitem 1 inside timeline "},
                    new ContentItem() { Title = "Contentitem 2 inside timeline "}
                }
            });
            TimelineController target = new TimelineController(mock.Object);

            // Act
            Timeline result = target.Get(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Europese geschiendenis", result.Title);
            Assert.AreEqual(2, result.ContentItems.Count());
            mock.Verify(verify => verify.FindTimeline(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }
        /// <summary>
        /// Try to retrieve a timeline with a wrong id
        /// </summary>

        [TestMethod]
        public void GetTimelineWithWrongId()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindTimeline(It.IsAny<int>())).Returns(new Timeline() // TODO: normally this would return a null ?!
            {
                Id = 1,
                Title = "Amerikaanse geschiendenis",
                ContentItems = new ContentItem[]
                {
                    new ContentItem() { Title = "Contentitem 1 inside timeline "},
                    new ContentItem() { Title = "Contentitem 2 inside timeline "}
                }
            });
            TimelineController target = new TimelineController(mock.Object);

            // Act
            Timeline result = target.Get(2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreNotEqual(2, result.Id);
            Assert.AreNotEqual("Europese geschiendenis", result.Title);
            Assert.AreNotEqual(1, result.ContentItems.Count());
            mock.Verify(verify => verify.FindTimeline(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }
    }
}
