using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Logic;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class ReportController : CustomApiController
    {
        [HttpGet]
        public IHttpActionResult GetReport(string reportType, int meetingId, DateTime meetingDate)
        {
            var report = new ReportGridViewModel();
            var ml = new MeetingLogic();

            switch (reportType)
            {
                // TODO: Move header list to logic class keyed by report type
                case "attend30":
                    report = ml.GetMeetingMembersAndPastData(meetingId, meetingDate, meetingDate.Subtract(new TimeSpan(30,0,0,0))); // Last 30 days
                    break;
                case "attend60":
                    report = ml.GetMeetingMembersAndPastData(meetingId, meetingDate, meetingDate.Subtract(new TimeSpan(60, 0, 0, 0))); // Last 30 days
                    break;
                case "attend90":
                    report = ml.GetMeetingMembersAndPastData(meetingId, meetingDate, meetingDate.Subtract(new TimeSpan(90, 0, 0, 0))); // Last 30 days
                    break;
                case "attend1":
                    meetingDate = meetingDate == DateTime.MinValue ? DateTime.Now : meetingDate;
                    var userAttendMeeting = ml.GetMeetingMembersData(meetingId, meetingDate);
                    report.Headers = new List<ReportGridHeaderViewModel>() {
                        new ReportGridHeaderViewModel { Title = "Full Name", Key = "fullName" },
                        new ReportGridHeaderViewModel { Title = "Attendance", Key = "attendTypeName" }
                    };
                    report.Data = Mapper.Map<IEnumerable<UserViewModel>>(userAttendMeeting.Where(uam => uam.AttendType != Data.AttendTypeEnum.Present));
                    break;
                case "recent":
                    break;

                default:
                    return BadRequest("Report not found");
            }
            return Ok(report);

        }

        [HttpGet]
        public IHttpActionResult test()
        {
            return Ok("Some test Test");
        }
    }
}
