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
        public void ContentItemService_Find_Test()
        {
            // Arrange
            Mock<IContentItemDao> mock = new Mock<IContentItemDao>(MockBehavior.Strict);
            mock.Setup(setup => setup.Find(It.IsAny<long>(), It.IsAny<int>())).Returns(new ContentItem
            {
                Id = 1,
                Title = "Bevrijding",
                BeginDate = 1945M,
                EndDate = 1945M,
                SourceURL = "UrlNaSource",
                HasChildren = true,
                Children = new ContentItem[2]
            });
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            ContentItem result = target.Find(1, 1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual("Bevrijding", result.Title);
            Assert.AreEqual(1945M, result.BeginDate);
            Assert.AreEqual(1945M, result.EndDate);
            Assert.AreEqual("UrlNaSource", result.SourceURL);
            Assert.AreEqual(true, result.HasChildren);
            Assert.AreEqual(2, result.Children.Length);
            mock.Verify(verify => verify.Find(It.IsAny<long>(), It.IsAny<int>()), Times.Once);
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
                SourceURL = "UrlNaSource",
                HasChildren = false,
            });

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(123, result.Id);
            Assert.AreEqual("Bevrijding", result.Title);
            Assert.AreEqual(1945M, result.BeginDate);
            Assert.AreEqual(1945M, result.EndDate);
            Assert.AreEqual("UrlNaSource", result.SourceURL);
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
