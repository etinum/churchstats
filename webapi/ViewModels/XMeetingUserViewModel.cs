using System;
using Data;

namespace webapi.ViewModels
{
    public class XMeetingUserViewModel
    {
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public MemberTypeEnum? MemberType { get; set; }
        public bool? Active { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public int? CreatedByUserId { get; set; }
        public int? ModifiedByUserId { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}
