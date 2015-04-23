using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using ChronoZoom.API.Services;
using ChronoZoom.API.Entities;
using ChronoZoom.API.Controllers;
using System.Collections.Generic;
using System.Linq;


namespace ChronoZoom.API.Tests.Controllers
{
    [TestClass]
    public class ContentItemControllerTest
    {
        /// <summary>
        /// Mock and retrieve a contentitem with given id
        /// </summary>
        [TestMethod]
        public void GetContentItemWithId()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindContentItems(It.IsAny<int>())).Returns(new ContentItem[] { new ContentItem()
            {
                Id = 1,
                BeginDate = 1910,
                EndDate = 1920,
                Depth = 1,
                HasChildren = false,
                Source = "data:image/png;base64,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",
                Title = "Test contentitem 1"
            }});
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IEnumerable<ContentItem> result = target.Get(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.ToList()[0].Id);
            Assert.AreEqual("Test contentitem 1", result.ToList()[0].Title);
            Assert.AreEqual(1, result.ToList()[0].Depth);
            mock.Verify(verify => verify.FindContentItems(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }
        /// <summary>
        /// Try to retrieve contentitem with a wrong id
        /// </summary>
        [TestMethod]
        public void GetContentItemWithWrongId()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindContentItems(It.IsAny<int>())).Returns(new ContentItem[] { new ContentItem() // TODO: normally this would return a null ?!
            {
                Id = 1,
                BeginDate = 1910,
                EndDate = 1920,
                Depth = 1,
                HasChildren = false,
                Source = "data:image/png;base64,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",
                Title = "Test contentitem 1"
            }});
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IEnumerable<ContentItem> result = target.Get(2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreNotEqual(2, result.ToList()[0].Id);
            Assert.AreNotEqual("Test contentitem 2", result.ToList()[0].Title);
            Assert.AreNotEqual(2, result.ToList()[0].Depth);
            mock.Verify(verify => verify.FindContentItems(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }

        /// <summary>
        /// Mock and get a list of all the available timelines
        /// </summary>

        [TestMethod]
        public void GetListOfContentItems()
        {
            // Arrange
            Mock<IContentItemService> mock = new Mock<IContentItemService>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.FindContentItems(It.IsAny<int>())).Returns(new List<ContentItem>()
            {
            new ContentItem()
            {
                Id = 1,
                BeginDate = 1910,
                EndDate = 1920,
                Depth = 1,
                HasChildren = true,
                Source = "data:image/png;base64,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",
                Title = "Test contentitem 1"
            },
            new ContentItem()
            {
                Id = 2,
                BeginDate = 1910,
                EndDate = 1920,
                Depth = 2,
                HasChildren = false,
                Source = "data:image/png;base64,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",
                Title = "Test contentitem 2"
            }
            });
            ContentItemController target = new ContentItemController(mock.Object);

            // Act
            IEnumerable<ContentItem> result = target.Get(1);

            //// Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Test contentitem 1", result.ToList()[0].Title);
            Assert.AreEqual(1, result.ToList()[0].Depth);
            Assert.AreEqual(true, result.ToList()[0].HasChildren);
            mock.Verify(verify => verify.FindContentItems(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }
    }
}
