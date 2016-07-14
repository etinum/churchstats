using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using CsvHelper;
using Data;

namespace LogicTest
{
    [TestClass]
    public class BaseTest
    {
        protected CStatsEntities testCtx;

        [TestInitialize]
        public void Init()
        {
            var reader = File.OpenText(@"MockData/UserTestData.csv");
            var userReader = new CsvReader(reader);
            
            var data = userReader.GetRecords<User>().ToList().AsQueryable();

            var mockSet = new Mock<DbSet<User>>(MockBehavior.Loose);
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());


            var mockContext = new Mock<CStatsEntities>();
            mockContext.Setup(m => m.Users).Returns(mockSet.Object);
            mockContext.Setup(m => m.SaveChanges());
            testCtx = mockContext.Object;
        }
    }
}
