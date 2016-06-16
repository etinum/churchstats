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
        public IEnumerable<Meeting> GetMeetingsByUser(int userId)
        {
            var meetingIds = _ctx.X_User_Meeting.Where(x => x.UserId == userId).Select(x=>x.MeetingId);
            return _ctx.Meetings.Where(x => meetingIds.Contains(x.Id)).ToList();
        }
        public IEnumerable<MeetingType> GetMeetingType()
        {
            return _ctx.MeetingTypes.ToList();
        }
        public bool SaveMeeting(string meetingName, int meetingTypeId)
        {
            var meeting = new Meeting();
            meeting.Name = meetingName;
            meeting.MeetingTypeId = meetingTypeId;
            _ctx.Meetings.Add(meeting);
            return _ctx.SaveChanges() > 0;
        }
    }
}
