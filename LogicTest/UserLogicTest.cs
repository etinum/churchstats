using data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace LogicTest
{
    [TestClass]
    public class UserLogicTest : BaseTest
    {
        private UserLogic userLogic;

        [TestInitialize]
        public void UserInit()
        {
            userLogic = new UserLogic(testCtx);
        }

        [TestMethod]
        public void Get()
        {
            var users = testCtx.Users.ToList();

            Assert.IsNotNull(users);
        }
    }
}
