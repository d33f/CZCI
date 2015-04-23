using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using ChronoZoom.Database.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ChronoZoom.Database.Tests
{
    [TestClass]
    public class Neo4JContentItemDatabaseTest
    {
        /// <summary>
        /// Retrieve a contentitem with given id from the actual NEO4J database
        /// </summary>
        [TestMethod]
        public void GetContentItemWithIdFromDatabase()
        {
            // Arrange
            Mock<IContentItemDatabase> mock = new Mock<IContentItemDatabase>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.Find(It.IsAny<int>())).Returns(new ContentItem());

            Neo4JContentItemDatabase target = new Neo4JContentItemDatabase();

            // Act
            ContentItem result = target.Find(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual("Content item " + result.Id, result.Title);
            Assert.AreEqual(1, result.Depth);
            //mock.Verify(verify => verify.Find(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }

        /// <summary>
        /// Try to get a contentitem with a wrong id from the actual NEO4J database
        /// </summary>
        [TestMethod]
        public void GetContentItemWithWrongIdFromDatabase()
        {
            // Arrange
            Mock<IContentItemDatabase> mock = new Mock<IContentItemDatabase>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
            mock.Setup(setup => setup.Find(It.IsAny<int>())).Returns(new ContentItem());

            Neo4JContentItemDatabase target = new Neo4JContentItemDatabase();

            // Act
            ContentItem result = target.Find(2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreNotEqual(1, result.Id);
            Assert.AreNotEqual("Content item " + 1, result.Title);
            Assert.AreNotEqual(3, result.Depth);
            //mock.Verify(verify => verify.Find(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        }

        ///// <summary>
        ///// Retrieve a list of contentitems from the actual NEO4J database 
        ///// </summary>
        //[TestMethod]
        //public void GetListOfContentItemsFromDatabase()
        //{
        //    // Arrange
        //    Mock<IContentItemDatabase> mock = new Mock<IContentItemDatabase>(MockBehavior.Strict); // MockBehavior.Strict will throw exceptions for methods called without a setup (see next line) defined
        //    mock.Setup(setup => setup.List()).Returns(new List<ContentItem>());

        //    Neo4JContentItemDatabase target = new Neo4JContentItemDatabase();

        //    // Act
        //    List<ContentItem> result = target.List().ToList();

        //    // Assert
        //    Assert.IsNotNull(result);
        //    Assert.AreEqual(3, result.Count());
        //    Assert.AreEqual("Content item 1", result[0].Title);
        //    Assert.AreEqual(false, result[2].HasChildren);
        //    //mock.Verify(verify => verify.Find(It.IsAny<int>()), Times.Once); // Verify that method is called and that it is called only once!
        //}
    }
}
