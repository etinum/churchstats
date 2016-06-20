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
            return _ctx.Attendances.Where(att => att.MeetingId == meetingId && att.LastUpdated > updatesSince).ToList();
        }

        public bool SaveAttendance(int userId, int meetingId, bool isAttend, int recorderId)
        {
            if (meetingId <=  0 || userId <=  0 || recorderId <= 0) return false;

            var attendencesForUserToday = _ctx.Attendances.Where(att => att.UserId == userId && att.MeetingId == meetingId && att.DateRecorded > DateTime.Today);

            if (attendencesForUserToday.Count() == 0)
            {
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
            }
            else
            {
                foreach (var att in attendencesForUserToday)
                {
                    att.LastUpdated = DateTime.Now;
                    att.RecorderId = recorderId;
                    att.isAttend = isAttend;
                }
            }
            return _ctx.SaveChanges() > 0;
        }
    }
}
