using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using webapi.ViewModels;
using Data;
using Microsoft.Ajax.Utilities;

namespace webapi.Logic
{
    public class MeetingLogic : CustomLogic
    {
        public IEnumerable<UserViewModel> GetMeetingMembersData(int meetingId, DateTime meetingDate)
        {
            var listX = Ctx.X_User_Meeting.Where(r => r.Active.Value && r.MeetingId == meetingId).ToList();

            var listAttendOnDate =
                Ctx.Attendances.Where(
                    r =>
                        r.MeetingId == meetingId &&
                        (DbFunctions.TruncateTime(r.MeetingDate.Value) == DbFunctions.TruncateTime(meetingDate))).
                        GroupBy(a => a.UserId).Select(a => a.FirstOrDefault()).ToList();

            var users = Ctx.Users.ToList();


            var userVms = (from x in listX
                           join u in users
                               on x.UserId equals u.Id
                           join att in listAttendOnDate
                     on x.UserId equals att.UserId
                     into list1
                           from l in list1.DefaultIfEmpty(new Attendance())
                           join u2 in users
                               on l.RecorderId equals u2.Id
                               into list2
                           from l2 in list2.DefaultIfEmpty(new User())
                           select GenUserVm(u, l2, l, x));


            // If date is historical (not today)
            if (meetingDate.Date != DateTime.Today)
            {

                var userHaveAttVms = (from att in listAttendOnDate
                                      join u in users
                                          on att.UserId equals u.Id
                                          into list1
                                      from l in list1.DefaultIfEmpty(new User())
                                      join u2 in users
                                          on att.RecorderId equals u2.Id
                                          into list2
                                      from l2 in list2.DefaultIfEmpty(new User())
                                      select GenUserVm(l, l2, att, new X_User_Meeting()));

                userVms = userVms.Concat(userHaveAttVms).DistinctBy(r => r.Id);

            }

            return userVms;
        }

        internal ReportGridViewModel GetMeetingMembersAndPastData(int meetingId, DateTime meetingDate, DateTime dateFrom)
        {
            var report = new ReportGridViewModel();
            // The goal here is to get every attendance since the fromDate and extrapolate how many meetings there were and how many each person made.
            var attendancesSinceDate =
                Ctx.Attendances.Where(m => m.MeetingId == meetingId && m.MeetingDate >= dateFrom.Date).ToList(); // Force DB call so we can group by dates 
            
            //TODO: Add in all users linked to this meeting
            var users = attendancesSinceDate.DistinctBy(a => a.UserId).Select(a => a.User1).ToList(); // User1 is actual attendance  user. *shrugs*

            var attendencesByMeeting = attendancesSinceDate.GroupBy(a => a.MeetingDate.GetValueOrDefault().Date ).ToList();
            int numMeetings = attendencesByMeeting.Count;

            // Rather than make a view model, we use dynamic type.
            var userCounts = new List<dynamic>();

            if (numMeetings > 0) // avoid divide by 0
            {
                foreach (var user in users)
                {

                    var userAttendances = attendancesSinceDate.Where(a => a.UserId == user.Id);
                    // Calculate attendance since dateFrom.
                    int attends = userAttendances.Count(ua => ua.AttendType == AttendTypeEnum.Present);
                    int absents = userAttendances.Count(ua => ua.AttendType == AttendTypeEnum.Absent);

                    AttendTypeEnum meetingDateAttendance = userAttendances.FirstOrDefault(ua => ua.MeetingDate.GetValueOrDefault().Date == meetingDate.Date)?.AttendType ?? AttendTypeEnum.Unknown;

                    var userData = new
                    {
                        fullName = user.FirstName + ' ' + user.LastName,
                        attendTypeName = meetingDateAttendance.ToString(), // Get Friendly Name,
                        percentAttend = (attends * 100) / numMeetings,
                        percentAbsent = (absents * 100) / numMeetings
                    };

                    userCounts.Add(userData);
                }

                report.Headers = GetReportHeaders("attend");
                report.Data = userCounts;
                return report;
            }
            else
            {
                var errors = new List<dynamic>();
                errors.Add(new { message = "No Results" });
                report.Headers = GetReportHeaders("error");
                report.Data = errors;
                return report;
            }



        }

        private UserViewModel GenUserVm(User u, User recorderUser, Attendance a, X_User_Meeting x)
        {
            var uVm = Mapper.Map<UserViewModel>(u);
            uVm.AttendanceId = a.Id;
            uVm.AttendType = a.Id == 0 ? AttendTypeEnum.Unknown : a.AttendType;
            uVm.MemberType = a.MemberType ?? x.MemberType;
            uVm.RecorderId = a.RecorderId;
            uVm.LastRecorded = a.ModifiedDate;
            uVm.AttendanceNotes = a.Notes;
            uVm.RecorderName = recorderUser.Id == 0 ? null : recorderUser.FirstName + ' ' + recorderUser.LastName;
            return uVm;

        }

        private List<ReportGridHeaderViewModel> GetReportHeaders(string reportName)
        {
            switch (reportName)
            {
                case "attend":
                    return new List<ReportGridHeaderViewModel>() {
                        new ReportGridHeaderViewModel { Title = "Full Name", Key = "fullName" },
                        new ReportGridHeaderViewModel { Title = "Attendance", Key = "attendTypeName" },
                        new ReportGridHeaderViewModel { Title = "Percent Present Last 30 Days", Key = "percentAttend" },
                        new ReportGridHeaderViewModel { Title = "Percent Absent Last 30 Days", Key = "percentAbsent" }
                    };
                case "attend2":
                    return new List<ReportGridHeaderViewModel>() {
                        new ReportGridHeaderViewModel { Title = "Full Name", Key = "fullName" },
                        new ReportGridHeaderViewModel { Title = "Attendance", Key = "attendTypeName" }
                    };
                case "error":
                    return new List<ReportGridHeaderViewModel>()
                    {
                        new ReportGridHeaderViewModel() {Title = "Message", Key= "message" }
                    };
            }

            return new List<ReportGridHeaderViewModel>();
        }
    }
}
