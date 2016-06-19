using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class AttendanceLogic
    {
        private chruchstatsEntities _ctx;

        public AttendanceLogic()
        {
            _ctx = new chruchstatsEntities();
        }

        public bool UpdateAttendance(Attendance attendance)
        {
            return false;
        }

        public IEnumerable<Attendance> GetMeetingUpdate(int meetingId, DateTime updatesSince)
        {
            return _ctx.Attendances.Where(att => att.MeetingId == meetingId && att.DateRecorded > updatesSince).ToList();
        }

        public bool SaveAttendance(int userId, int meetingId, bool isAttend, int recorderId)
        {
            if (meetingId == 0 || userId == 0) return false;
            var attendance = new Attendance
            {
                UserId = userId,
                MeetingId = meetingId,
                isAttend = isAttend,
                RecorderId = recorderId,
                LastUpdated = DateTime.Now,
                DateRecorded = DateTime.Now
            };
            _ctx.Attendances.Add(attendance);
            return _ctx.SaveChanges() > 0;
        }
    }
}
