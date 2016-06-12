using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using data;
using Moq;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using CsvHelper;

namespace LogicTest
{
    [TestClass]
    public class BaseTest
    {
        protected chruchstatsEntities testCtx;

        [TestInitialize]
        public void Init()
        {
            var reader = File.OpenText(@"MockData/UserTestData.csv");
            var userReader = new CsvReader(reader);
            //var data = new List<User>
            //{
            //    new User { FirstName = "BBB" },
            //    new User { FirstName = "ZZZ" },
            //    new User { FirstName = "AAA" },
            //}.AsQueryable();

            var data = userReader.GetRecords<User>().ToList().AsQueryable();

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

            var mockContext = new Mock<chruchstatsEntities>();
            mockContext.Setup(m => m.Users).Returns(mockSet.Object);
            mockContext.Setup(m => m.SaveChanges());
            testCtx = mockContext.Object;
        }
    }
}
