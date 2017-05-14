using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webapi.ViewModels;

namespace webapi.Logic
{
    public class ReportLogic : BaseLogic
    {
        public ReportGridViewModel GetReport(string reportType, int meetingId, DateTime meetingDate, List<string> errors)
        {
            var report = new ReportGridViewModel();
            var ml = new MeetingLogic();
            switch (reportType)
            {
                // TODO: Move header list to logic class keyed by report type
                case "attend30":
                    report = ml.GetMeetingMembersAndPastData(meetingId, meetingDate, meetingDate.Subtract(new TimeSpan(30, 0, 0, 0))); // Last 30 days
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
                    errors?.Add("Report not found");
                    break;
            }
            return report;
        }

        public string ReportToHtml(ReportGridViewModel report)
        {
            var html = new StringBuilder();
            var keys = new List<string>();
            html.Append(@"
            <body style='margin: 0; padding: 0;'>
             <table border='1' cellpadding='0' cellspacing='0' width='100%'>");

            foreach (var header in report.Headers)
            {
                html.Append($"<th>{header.Title}</th>");
                keys.Add(header.Key);
            }

            foreach (var row in report.Data)
            {
                html.Append(@"<tr>");
                foreach (var key in keys)
                {
                    var type = row.GetType();
                    var props = type.GetProperties();
                    var prop = props.FirstOrDefault(p => p.Name == key);

                    html.Append($"<td>{prop?.GetValue(row) ?? ""}</td>");
                }
                html.Append(@"</tr>");
            }

            html.Append(@" </table></body>");
            return html.ToString();
        }

        public void SendWeeklyAttendance()
        {
            var mailer = new Mailer();
            mailer.SendReport(GetReport("attend30", 1, DateTime.Today, new List<string>()), "Weekly Attendance");
        }
    }
}
