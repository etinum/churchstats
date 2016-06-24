using System;

namespace webapi.ViewModels
{
    public class MeetingViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MeetingTypeId { get; set; }
        public int? DayOfTheWeek { get; set; }
        public string Description { get; set; }
        public DateTime? UsualTime { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
