using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using webapi.Hub;

namespace webapi.Controllers
{
    public class MeetingController : ApiControllerWithHub<AttendHub>
    {
        MeetingLogic meetingLogic;

        public MeetingController()
        {
            meetingLogic = new MeetingLogic();
        }

        public IEnumerable<Meeting> Get()
        {

            Hub.Clients.All.ClientCall();
            return new Meeting[] {new Meeting() {Name = "TestMeeting", Description = "Test Description"}};
        }

        public bool AddUserToMeeting(int userId, int meetingId)
        {
            return meetingLogic.AddUserToMeeting(userId, meetingId);
        }

    }
}
