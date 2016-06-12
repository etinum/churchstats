using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class MeetingLogic
    {
        private chruchstatsEntities _ctx;

        public MeetingLogic()
        {
            _ctx = new chruchstatsEntities();
        }

        public IEnumerable<Meeting> GetAllMeetings()
        {
            return _ctx.Meetings.ToList();
        }

        public bool AddUserToMeeting(int userId, int meetingId)
        {
            var newLink = new X_User_Meeting();
            newLink.MeetingId = meetingId;
            newLink.UserId = userId;
            newLink.Active = true;
            _ctx.X_User_Meeting.Add(newLink);
            return _ctx.SaveChanges() > 0;
        }
    }
}
