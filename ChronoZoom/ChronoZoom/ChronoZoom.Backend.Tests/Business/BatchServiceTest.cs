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
    public class BatchServiceTest
    {
        [TestMethod]
        public void BatchService_ProcessFile_Test()
        {
            // Arrange
            BatchService target = new BatchService();

            // Act
            int result = target.ProcessFile("../../../batch.txt");

            // Assert
            Assert.IsTrue(result > 0);
        }
    }
}
