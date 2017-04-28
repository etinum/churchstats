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
        [HttpPost]
        public IHttpActionResult GetReport(ReportRequestViewModel reportType)
        {
            var report = new ReportGridViewModel();

            switch (reportType.ReportType)
            {
                case "attend":
                    var meeting = Ctx.Meetings.Where(m => m.MeetingTypeId == reportType.MeetingId);
                    report.Headers = new List<ReportGridHeaderViewModel>() { new ReportGridHeaderViewModel { Title = "Name", Key = "name" } };
                    report.Data =  Mapper.Map<IEnumerable<MeetingViewModel>>(meeting);
                    break;
                case "attend2":
                    reportType.MeetingDate = reportType.MeetingDate == DateTime.MinValue ? DateTime.Now : reportType.MeetingDate;
                    var ml = new MeetingLogic();
                    var userAttendMeeting = ml.GetMeetingMembersData(reportType.MeetingId, reportType.MeetingDate);
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
