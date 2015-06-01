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
    public class ContentItemServiceTest
    {
        [TestMethod]
        public void ContentItemService_GetAll_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.FindAllBy(It.IsAny<long>())).Returns(new ContentItem[] 
            {
                new ContentItem()
                {
                    Id = 1,
                    Title = "Bevrijding",
                    BeginDate = 1945M,
                    EndDate = 1945M,
                    Source = "UrlNaSource",
                    HasChildren = false,
                }
            });
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            IEnumerable<ContentItem> result = target.GetAll(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());
            ContentItem resultFirst = result.First();
            Assert.AreEqual(1, resultFirst.Id);
            Assert.AreEqual("Bevrijding", resultFirst.Title);
            Assert.AreEqual(1945M, resultFirst.BeginDate);
            Assert.AreEqual(1945M, resultFirst.EndDate);
            Assert.AreEqual("UrlNaSource", resultFirst.Source);
            Assert.AreEqual(false, resultFirst.HasChildren);
            mock.Verify(verify => verify.FindAllBy(It.IsAny<long>()), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(ContentItemsNotFoundException))]
        public void ContentItemService_GetAll_NotFoundException_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.FindAllBy(It.IsAny<long>())).Throws(new ContentItemsNotFoundException());
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            target.GetAll(-1);
        }

        [TestMethod]
        public void ContentItemService_Add_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<ContentItem>()))
                .Callback((ContentItem contentItem) => contentItem.Id = 123)
                .Returns((ContentItem contentItem) => { return contentItem; });
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            ContentItem result = target.Add(new ContentItem()
            {
                Title = "Bevrijding",
                BeginDate = 1945M,
                EndDate = 1945M,
                Source = "UrlNaSource",
                HasChildren = false,
            });

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(123, result.Id);
            Assert.AreEqual("Bevrijding", result.Title);
            Assert.AreEqual(1945M, result.BeginDate);
            Assert.AreEqual(1945M, result.EndDate);
            Assert.AreEqual("UrlNaSource", result.Source);
            Assert.AreEqual(false, result.HasChildren);
            mock.Verify(verify => verify.Add(It.IsAny<ContentItem>()), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void ContentItemService_Add_DontCatchException_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Add(It.IsAny<ContentItem>())).Throws(new Exception());
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            target.Add(new ContentItem());
        }

        [TestMethod]
        public void ContentItemService_Update_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<ContentItem>()));
            ContentItemService target = new ContentItemService(mock.Object);
            ContentItem contentItem = new ContentItem();

            // Act
            target.Update(contentItem);
            mock.Verify(verify => verify.Update(contentItem), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void ContentItemService_Update_DontCatchException_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Update(It.IsAny<ContentItem>())).Throws(new Exception());
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            target.Update(new ContentItem());
        }
    }
}
