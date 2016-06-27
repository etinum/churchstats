using System;

namespace webapi.ViewModels
{
    public class AttendanceViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public int RecorderId { get; set; }
        public bool? IsAttend { get; set; }
        public DateTime? MeetingDate { get; set; }
        public string Notes { get; set; }


    }
}