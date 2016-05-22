using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using System.Data.Entity;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {
        private chruchstatsEntities data;
        public UserController()
        {
            data = new chruchstatsEntities();
        }

        // GET api/<controller>
        public IEnumerable<User> Get()
        {
            return new User[] { new User() {Age = 1, FirstName = "Test", LastName = "User"} };
        }

        // GET api/<controller>/5
        public User Get(int id)
        {
            return data.Users.FirstOrDefault(u => u.Id == id);
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}