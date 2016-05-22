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
    }
}
