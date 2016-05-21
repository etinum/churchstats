using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;

namespace webapi.Controllers
{
    public class MeetingController : ApiController
    {
        public IEnumerable<Meeting> Get()
        {
            return new Meeting[] {new Meeting() {MeetingName = "TestMeeting", Description = "Test Description"}};
        }
    }
}
