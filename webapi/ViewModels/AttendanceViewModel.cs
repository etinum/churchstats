using System;
using System.Collections.Generic;

namespace webapi.ViewModels
{
    public class AttendanceViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public int RecorderId { get; set; }
        public DateTime DateRecorded { get; set; }
        public DateTime LastUpdated { get; set; }
        public DateTime? MeetingDate { get; set; }
        public int? AttendTypeId { get; set; }
        public bool? IsVisitor { get; set; }
        public string Notes { get; set; }
        public bool? IsArchive { get; set; }


    }
}