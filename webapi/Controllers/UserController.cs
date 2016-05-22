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
        private chruchstatsEntities _ctx;
        public UserController()
        {
            _ctx = new chruchstatsEntities();
        }

        // GET api/<controller>
        public IEnumerable<User> Get()
        {
            return new User[] { new User() {Age = 1, FirstName = "Test", LastName = "User"} };
        }

        // GET api/<controller>/5
        public User Get(int id)
        {
            return _ctx.Users.FirstOrDefault(u => u.Id == id);
        }

        public bool Update(User user)
        {
            if (user == null || user.Id <= 0) return false;

            var olduser = _ctx.Users.FirstOrDefault(u => u.Id == user.Id);

            if (olduser == null) return false;

            _ctx.Users.AddOrUpdate(user);
            _ctx.SaveChanges();

            return true;
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}