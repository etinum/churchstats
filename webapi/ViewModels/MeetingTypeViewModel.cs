using System;

namespace webapi.ViewModels
{
    public class MeetingTypeViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public int? CreatedByUserId { get; set; }
        public int? ModifiedByUserId { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}