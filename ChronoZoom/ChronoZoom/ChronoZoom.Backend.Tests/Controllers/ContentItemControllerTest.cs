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
            mock.Setup(setup => setup.GetAll(It.IsAny<int>())).Returns(new Entities.ContentItem[2]);
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IHttpActionResult result = target.Get(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<IEnumerable<ContentItem>>);
            Assert.AreEqual(2, (result as OkNegotiatedContentResult<IEnumerable<ContentItem>>).Content.Count());
            mock.Verify(verify => verify.GetAll(It.IsAny<int>()), Times.Once);
        }

        [TestMethod]
        public void ContentItemController_Get_BadRequest_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.GetAll(It.IsAny<int>())).Throws(new Exception());
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IHttpActionResult result = target.Get(-1);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void ContentItemController_Put_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<ContentItem>()));
            ContentItemController target = new ContentItemController(mock.Object);
            ContentItem item = new ContentItem()
            {
                BeginDate = -1,
                EndDate = -1,
                Title = "test",
                ParentId = 1,
                HasChildren = false,
                Id = 1,
                SourceRef = string.Empty,
                SourceURL = string.Empty
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<ContentItem>(item);
            IHttpActionResult result = target.Put(item);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkResult);
            mock.Verify(verify => verify.Update(It.IsAny<ContentItem>()), Times.Once);
        }

        [TestMethod]
        public void ContentItemController_Put_Validation_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<ContentItem>()));
            ContentItemController target = new ContentItemController(mock.Object);
            ContentItem item = new ContentItem()
            {
                HasChildren = false,
                SourceRef = string.Empty,
                SourceURL = string.Empty
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<ContentItem>(item);
            IHttpActionResult result = target.Put(item);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
            Assert.AreEqual(false, target.ModelState.IsValid);
            Assert.AreEqual(3, target.ModelState.Count);
        }

        [TestMethod]
        public void ContentItemController_Put_BadRequest_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<ContentItem>())).Throws(new Exception());
            ContentItemController target = new ContentItemController(mock.Object);
            
            // Act
            IHttpActionResult result = target.Put(new ContentItem());

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void ContentItemController_Post_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<ContentItem>())).Returns(new ContentItem()
            {
                Id = 123
            });
            ContentItemController target = new ContentItemController(mock.Object);
            ContentItem item = new ContentItem()
            {
                BeginDate = -1,
                EndDate = -1,
                Title = "test",
                ParentId = 1,
                HasChildren = false,
                SourceRef = string.Empty,
                SourceURL = string.Empty
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<ContentItem>(item);
            IHttpActionResult result = target.Post(item);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is OkNegotiatedContentResult<ContentItem>);
            Assert.AreEqual(123, (result as OkNegotiatedContentResult<ContentItem>).Content.Id);
            mock.Verify(verify => verify.Add(It.IsAny<ContentItem>()), Times.Once);
        }

        [TestMethod]
        public void ContentItemController_Post_Validation_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<ContentItem>()));
            ContentItemController target = new ContentItemController(mock.Object);
            ContentItem item = new ContentItem()
            {
                HasChildren = false,
                Id = 0,
                SourceRef = string.Empty,
                SourceURL = string.Empty
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<ContentItem>(item);
            IHttpActionResult result = target.Post(item);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
            Assert.AreEqual(false, target.ModelState.IsValid);
            Assert.AreEqual(3, target.ModelState.Count);
        }

        [TestMethod]
        public void ContentItemController_Post_InvalidID_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<ContentItem>()));
            ContentItemController target = new ContentItemController(mock.Object);
            ContentItem item = new ContentItem()
            {
                BeginDate = -1,
                EndDate = -1,
                Title = "test",
                ParentId = 1,
                HasChildren = false,
                Id = 0,
                SourceRef = string.Empty,
                SourceURL = string.Empty
            };

            // Act
            target.Configuration = new HttpConfiguration();
            target.Validate<ContentItem>(item);
            IHttpActionResult result = target.Post(item);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }

        [TestMethod]
        public void ContentItemController_Post_BadRequest_Test()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<ContentItem>())).Throws(new Exception());
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IHttpActionResult result = target.Post(new ContentItem());

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result is BadRequestErrorMessageResult);
        }
    }
}
