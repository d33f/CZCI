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
    public class ContentItemControllerTest
    {
        [TestMethod]
        public void ContentItemController_Get_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.GetAll(It.IsAny<string>())).Returns(new Entities.ContentItem[2]);
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IHttpActionResult result = target.Get("1:0");

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<IEnumerable<ContentItem>>);
            Assert.AreEqual(2, (result as OkNegotiatedContentResult<IEnumerable<ContentItem>>).Content.Count());
        }

        [TestMethod]
        public void ContentItemController_Get_NotFound_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.GetAll(It.IsAny<string>())).Throws(new ContentItemNotFoundException());
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IHttpActionResult result = target.Get("1:0");

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is NotFoundResult);
        }

        [TestMethod]
        public void ContentItemController_Get_BadRequest_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.GetAll(It.IsAny<string>())).Throws(new Exception());
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IHttpActionResult result = target.Get("-1");

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void ContentItemController_Put_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<ContentItem>()));
            ContentItemController target = new ContentItemController(mock.Object);
            ContentItem item = new ContentItem()
            {
                BeginDate = -1,
                EndDate = -1,
                HasChildren = false,
                Id = string.Empty,
                Priref = -1,
                Source = string.Empty,
                Title = string.Empty
            };

            // Act
            IHttpActionResult result = target.Put(item);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<bool>);
        }
    }
}
