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
    public class ContentItemServiceTest
    {
        [TestMethod]
        public void FindContentItems()
        {
            // Arrange
            Mock<IContentItemDatabase> mock = new Mock<IContentItemDatabase>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.List()).Returns(new List<Database.Entities.ContentItem>()
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
            });
            ContentItemService target = new ContentItemService(mock.Object);

            // Act
            List<API.Entities.ContentItem> result = target.FindContentItems(1).ToList();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual(0, result[0].Depth);
            Assert.AreEqual(2010, result[0].BeginDate);
            Assert.AreEqual(2011, result[0].EndDate);
            mock.Verify(verify => verify.List(), Times.Once); // Verify that method is called and that it is called only once!
        }
    }
}
