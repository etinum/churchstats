using System;
using Data;

namespace webapi.ViewModels
{
    public class AttendanceViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public int? RecorderId { get; set; }
        public DateTime DateRecorded { get; set; }
        public DateTime? MeetingDate { get; set; }
        public AttendTypeEnum? AttendType { get; set; }
        public MemberTypeEnum? MemberType { get; set; }
        public string Notes { get; set; }
        public bool? IsArchive { get; set; }
        public int? CreatedByUserId { get; set; }
        public int? ModifiedByUserId { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? CreatedDate { get; set; }


    }
}