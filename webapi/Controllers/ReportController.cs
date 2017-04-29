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

            switch (reportType)
            {
                // TODO: Move header list to logic class keyed by report type
                case "attend":
                    var meeting = Ctx.Meetings.Where(m => m.MeetingTypeId == meetingId);
                    report.Headers = new List<ReportGridHeaderViewModel>() { new ReportGridHeaderViewModel { Title = "Name", Key = "name" } };
                    report.Data =  Mapper.Map<IEnumerable<MeetingViewModel>>(meeting);
                    break;
                case "attend2":
                    meetingDate = meetingDate == DateTime.MinValue ? DateTime.Now : meetingDate;
                    var ml = new MeetingLogic();
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
