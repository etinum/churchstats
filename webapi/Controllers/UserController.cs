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
            return new UserLogic().GetAllMembers();
        }

        // GET api/<controller>/5
        public User Get(int id)
        {
            return new UserLogic().GetUserById(id);
        }

        public IEnumerable<User> GetMembersForMeeting(int meetingId)
        {
            return new UserLogic().GetMembers(meetingId);
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