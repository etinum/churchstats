using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using System.Data.Entity;
using System.Data.Entity.Migrations;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {

        // GET api/<controller>
        public IEnumerable<User> Get()
        {
<<<<<<< HEAD
            return _ctx.Users;
=======
            return new UserLogic().GetUsers();
>>>>>>> 39bc65b441c12c9ddfc150b26a28335791741590
        }

        // GET api/<controller>/5
        public User Get(int id)
        {
            return new UserLogic().GetUserById(id);
        }

        public bool Update(User user)
        {
            return new UserLogic().Update(user);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}