using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace webapi.ViewModels
{
    public class AttendanceViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public int RecorderId { get; set; }
        public bool IsAttend { get; set; }
    }
}