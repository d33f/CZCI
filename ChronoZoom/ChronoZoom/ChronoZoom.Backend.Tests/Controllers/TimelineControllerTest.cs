using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ChronoZoom.Backend.Controllers;
using ChronoZoom.Backend.Business.Interfaces;
using Moq;
using System.Web.Http;
using System.Web.Http.Results;
using ChronoZoom.Backend.Entities;
using ChronoZoom.Backend.Exceptions;
using System.Collections.Generic;

namespace ChronoZoom.Backend.Tests.Controllers
{
    [TestClass]
    public class TimelineControllerTest
    {
        [TestMethod]
        public void TimelineController_Get_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Get(It.IsAny<int>())).Returns(new Entities.Timeline()
            {
                Id =12
            });
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Get(12);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<Timeline>);
            Assert.AreEqual(12, (result as OkNegotiatedContentResult<Timeline>).Content.Id);
            mock.Verify(verify => verify.Get(It.IsAny<int>()), Times.Once);
        }
        
        [TestMethod]
        public void TimelineController_Get_NotFound_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Get(It.IsAny<int>())).Throws(new TimelineNotFoundException());
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Get(12);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is NotFoundResult);
        }

        [TestMethod]
        public void TimelineController_Get_BadRequest_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Get(It.IsAny<int>())).Throws(new Exception());
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Get(12);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void TimelineController_GetAll_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.GetAllPublicTimelinesWithoutContentItems()).Returns(new List<Entities.Timeline>()
            {
                new Timeline()
                {
                    Id = 1,
                    BeginDate = 1000,
                    EndDate = 1500,
                    Title = "Test 1"
                },
                new Timeline()
                {
                    Id = 2,
                    BeginDate = 1555,
                    EndDate = 1666,
                    Title = "Test 2"
                }
            });
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Get();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<IEnumerable<Timeline>>);
            Assert.AreEqual(2, ((OkNegotiatedContentResult<IEnumerable<Timeline>>) result).Content.Count());
            mock.Verify(verify => verify.GetAllPublicTimelinesWithoutContentItems(), Times.Once);
        }

        [TestMethod]
        public void TimelineController_GetAll_BadRequest_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Get(It.IsAny<int>())).Throws(new Exception());
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Get();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }


        [TestMethod]
        public void TimelineController_Put_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<Timeline>()));
            TimelineController target = new TimelineController(mock.Object);
            Timeline timeline = new Timeline()
            {
                Id = 1,
                BeginDate = -1,
                EndDate = -1,
                Title = "test",
                RootContentItem = null
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<Timeline>(timeline);
            IHttpActionResult result = target.Put(timeline);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkResult);
            mock.Verify(verify => verify.Update(It.IsAny<Timeline>()), Times.Once);
        }

        [TestMethod]
        public void TimelineController_Put_Validation_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<Timeline>()));
            TimelineController target = new TimelineController(mock.Object);
            Timeline timeline = new Timeline()
            {
                RootContentItem = null
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<Timeline>(timeline);
            IHttpActionResult result = target.Put(timeline);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
            Assert.AreEqual(false, target.ModelState.IsValid);
            Assert.AreEqual(3, target.ModelState.Count);
        }

        [TestMethod]
        public void TimelineController_Put_BadRequest_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<Timeline>())).Throws(new Exception());
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Put(new Timeline());

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void TimelineController_Post_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<Timeline>())).Returns(new Timeline()
            {
                Id = 123
            });
            TimelineController target = new TimelineController(mock.Object);
            Timeline timeline = new Timeline()
            {
                BeginDate = -1,
                EndDate = -1,
                Title = "test",
                RootContentItem = null
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<Timeline>(timeline);
            IHttpActionResult result = target.Post(timeline);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<long>);
            Assert.AreEqual((long)123, (result as OkNegotiatedContentResult<long>).Content);
            mock.Verify(verify => verify.Add(It.IsAny<Timeline>()), Times.Once);
        }

        [TestMethod]
        public void TimelineController_Post_Validation_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<Timeline>()));
            TimelineController target = new TimelineController(mock.Object);
            Timeline timeline = new Timeline()
            {
                RootContentItem = null
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<Timeline>(timeline);
            IHttpActionResult result = target.Post(timeline);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
            Assert.AreEqual(false, target.ModelState.IsValid);
            Assert.AreEqual(3, target.ModelState.Count);
        }

        [TestMethod]
        public void TimelineController_Post_InvalidID_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<Timeline>()));
            TimelineController target = new TimelineController(mock.Object);
            Timeline timeline = new Timeline()
            {
                BeginDate = -1,
                EndDate = -1,
                Title = "test"
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<Timeline>(timeline);
            IHttpActionResult result = target.Post(timeline);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void TimelineController_Post_BadRequest_Test()
        {
            // Arrange
            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<Timeline>())).Throws(new Exception());
            TimelineController target = new TimelineController(mock.Object);

            // Act
            IHttpActionResult result = target.Post(new Timeline());

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }
    }
}
