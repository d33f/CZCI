//using System;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using ChronoZoom.Backend.Controllers;
//using ChronoZoom.Backend.Business.Interfaces;
//using Moq;
//using System.Web.Http;
//using System.Web.Http.Results;
//using ChronoZoom.Backend.Entities;
//using ChronoZoom.Backend.Exceptions;

//namespace ChronoZoom.Backend.Tests.Controllers
//{
//    [TestClass]
//    public class TimelineControllerTest
//    {
//        [TestMethod]
//        public void TimelineController_Get_Test()
//        {
//            // Arrange
//            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
//            mock.Setup(setup => setup.Get(It.IsAny<int>())).Returns(new Entities.Timeline()
//            {
//                Id = 12
//            });
//            TimelineController target = new TimelineController(mock.Object);

//            // Act
//            IHttpActionResult result = target.Get();

//            // Assert
//            Assert.IsNotNull(result);
//            Assert.IsTrue(result is OkNegotiatedContentResult<Timeline>);
//            Assert.AreEqual(12, (result as OkNegotiatedContentResult<Timeline>).Content.Id);
//        }

//        [TestMethod]
//        public void TimelineController_Get_NotFound_Test()
//        {
//            // Arrange
//            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
//            mock.Setup(setup => setup.Get(It.IsAny<int>())).Throws(new TimelineNotFoundException());
//            TimelineController target = new TimelineController(mock.Object);

//            // Act
//            IHttpActionResult result = target.Get();

//            // Assert
//            Assert.IsNotNull(result);
//            Assert.IsTrue(result is NotFoundResult);
//        }

//        [TestMethod]
//        public void TimelineController_Get_BadRequest_Test()
//        {
//            // Arrange
//            Mock<ITimelineService> mock = new Mock<ITimelineService>(MockBehavior.Strict);
//            mock.Setup(setup => setup.Get(It.IsAny<int>())).Throws(new Exception());
//            TimelineController target = new TimelineController(mock.Object);

//            // Act
//            IHttpActionResult result = target.Get();

//            // Assert
//            Assert.IsNotNull(result);
//            Assert.IsTrue(result is BadRequestErrorMessageResult);
//        }
//    }
//}
