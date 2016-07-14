using System;
using Data;

namespace webapi.ViewModels
{
    public class XMeetingUserViewModel
    {
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public MemberTypeEnum? MemberType { get; set; }
        public DateTime? EffectiveDate { get; set; }

    }
}
