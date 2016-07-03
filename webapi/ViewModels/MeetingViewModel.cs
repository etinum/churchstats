using System;

namespace webapi.ViewModels
{
    public class MeetingViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MeetingTypeId { get; set; }
        public int? DayOfTheWeek { get; set; }
        public int? LeadUserId { get; set; }
        public int? AddressId { get; set; }
        public int? ContactInfoId { get; set; }
        public string Notes { get; set; }
        public DateTime? UsualTime { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
        public int? LastEditedBy { get; set; }

    }
}
