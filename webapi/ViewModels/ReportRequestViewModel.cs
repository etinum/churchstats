using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webapi.ViewModels
{
    public class ReportRequestViewModel
    {
        public string ReportType { get; set; }
        public int MeetingId { get; set; }
        public DateTime MeetingDate { get; set; }
    }
}
