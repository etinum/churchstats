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
    }
}
