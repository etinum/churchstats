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
    }
}
