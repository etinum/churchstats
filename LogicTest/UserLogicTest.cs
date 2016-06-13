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
            var users = userLogic.GetAllMembers();

            Assert.IsNotNull(users);
        }

        [TestMethod]
        public void GetFirstUser()
        {
            var user = userLogic.GetUserById(1);

            Assert.IsNotNull(user);
        }

        [TestMethod]
        // This method cannot be mocked currently. Pending some more advanded mocking techniques.
        public void UpdateUser()
        {
            var user = userLogic.GetUserById(1);

            user.BirthYear = 30;

            userLogic.Update(user);

            var user2 = userLogic.GetUserById(1);

            userLogic.ToString();
        }
    }
}
