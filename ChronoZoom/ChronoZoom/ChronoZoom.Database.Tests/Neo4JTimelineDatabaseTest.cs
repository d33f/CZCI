using ChronoZoom.Database.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.Database.Tests
{
    [TestClass]
    public class Neo4JTimelineDatabaseTest
    { /// <summary>
        /// Retrieve a specific timeline with given Id from the actual NEO4J database
        /// </summary>
        [TestMethod]
        public void GetTimelineWithIdFromDB()
        {
            // Arrange
            Neo4JTimelineDatabase target = new Neo4JTimelineDatabase();

            // Act
            Timeline result = target.FindTimeline(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual("Timeline met " + result.Id, result.Title);
            Assert.AreEqual(6, result.ContentItems.Count());
        }

        /// <summary>
        /// Try to get a timeline with a wrong id from the actual NEO4J database
        /// </summary>
        [TestMethod]
        public void GetTimelineWithWrongIdFromDB()
        {
            // Arrange
            Neo4JTimelineDatabase target = new Neo4JTimelineDatabase();

            // Act
            Timeline result = target.FindTimeline(2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreNotEqual(1, result.Id);
            Assert.AreNotEqual("Timeline met " + 1, result.Title);
            Assert.AreEqual(0, result.ContentItems.Count());
        }

        ///// <summary>
        ///// Get a list of timelines from the actual NEO4J database
        ///// </summary>
        //[TestMethod]
        //public void GetListOfTimelinesFromDB()
        //{
        //    // Arrange
        //    Neo4JTimelineDatabase target = new Neo4JTimelineDatabase();

        //    // Act
        //    List<Timeline> result = target.List().ToList();
                
        //    // Assert
        //    Assert.IsNotNull(result);
        //    Assert.AreEqual(3, result.Count());
        //    Assert.AreEqual("Timeline " + 1 + " inside list", result[0].Title);
        //    Assert.AreEqual(0, result[0].ContentItems.Count());
        //}
    }
}
