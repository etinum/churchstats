using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using webapi.ViewModels;
using AutoMapper;
using Data;
using webapi.Hubs;
using webapi.Mappers;
using webapi.Utils;


namespace webapi.Controllers
{
    public class MeetingController : ApiControllerWithHub<AttendHub>
    {

        [HttpGet]
        public IHttpActionResult GetAllMeetings()
        {
            var meetings = Ctx.Meetings.ToList();

            return Ok(Mapper.Map<List<MeetingViewModel>>(meetings));
        }

        [HttpGet]
        public IHttpActionResult GetAllMeetingTypes()
        {
            try
            {
                var meetingTypes = Ctx.MeetingTypes.ToList();
                return Ok(Mapper.Map<List<MeetingTypeViewModel>>(meetingTypes));
            }
            catch (Exception ex)
            {
                return Ok(ex);

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


        [HttpGet]
        public IHttpActionResult GetMeetingMembers(int meetingId, DateTime meetingDate)
        {



            var listX = Ctx.X_User_Meeting.Where(r => r.Active.Value && r.MeetingId == meetingId).ToList();

            var listAttendToday =
                Ctx.Attendances.Where(
                    r =>
                        r.MeetingId == meetingId &&
                        (DbFunctions.TruncateTime(r.MeetingDate.Value) == DbFunctions.TruncateTime(meetingDate))).
                        GroupBy(a => a.UserId).Select(a => a.FirstOrDefault()).ToList();

            var users = Ctx.Users.ToList();


            var userVms = from x in listX
                          join u in users
                              on x.UserId equals u.Id
                          join att in listAttendToday
                    on x.UserId equals att.UserId
                    into list1
                          from l in list1.DefaultIfEmpty(new Attendance())
                          join u2 in users
                              on l.RecorderId equals u2.Id
                              into list2
                          from l2 in list2.DefaultIfEmpty(new User())
                          select GenUserVm(u, l2, l, x);




            //var userVms = from x in listX
            //              join att in listAttendToday
            //                  on x.UserId equals att.UserId
            //                  into list1
            //              from l in list1.DefaultIfEmpty(new Attendance())
            //              join u in users
            //                  on l.UserId equals u.Id
            //                            into list2
            //              from l2 in list2.DefaultIfEmpty(new User())
            //                  //join u2 in users
            //                  //    on l.RecorderId equals u2.Id
            //                  //    into list2
            //                  //from l2 in list2.DefaultIfEmpty(new User())
            //              select GenUserVm(l2, null, l, x);



            //var attendances = (from a in Ctx.Attendances
            //                   where a.MeetingId == meetingId
            //                         && (DbFunctions.TruncateTime(a.MeetingDate.Value) == DbFunctions.TruncateTime(meetingDate))
            //                   select new
            //                   {
            //                       a.Id,
            //                       a.UserId,
            //                       a.AttendType,
            //                       a.RecorderId,
            //                       a.MemberType,
            //                       a.ModifiedDate,
            //                       a.Notes
            //                   });

            //var listXUserIdMemberType =
            //    Ctx.X_User_Meeting.Where(x => x.MeetingId == meetingId && x.Active.Value && x.EffectiveDate <= meetingDate)
            //        .Select(r => new
            //        {
            //            r.UserId,
            //            r.MemberType
            //        });

            //var listUserId = attendances.Select(a => a.UserId);

            //var totalListUserId = listXUserIdMemberType.Select(r => r.UserId).Concat(listUserId).Distinct();

            //var users = (from u in Ctx.Users
            //             join l in totalListUserId on u.Id equals l
            //             select u);

            //var userViewModels = Mapper.Map<List<UserViewModel>>(users);

            //var userList = Ctx.Users.ToList();

            //foreach (var userViewModel in userViewModels)
            //{
            //    var match = attendances.FirstOrDefault(r => r.UserId == userViewModel.Id);
            //    if (match == null)
            //    {
            //        userViewModel.AttendType = AttendTypeEnum.Unknown;
            //        if (listXUserIdMemberType.Select(r => r.UserId).Contains(userViewModel.Id))
            //        {
            //            userViewModel.MemberType =
            //                listXUserIdMemberType.First(r => r.UserId == userViewModel.Id).MemberType;
            //        }
            //        continue;
            //    }
            //    userViewModel.AttendType = match.AttendType;
            //    userViewModel.MemberType = match.MemberType;
            //    userViewModel.RecorderId = match.RecorderId;
            //    userViewModel.AttendanceId = match.Id;
            //    userViewModel.LastRecorded = match.ModifiedDate;
            //    userViewModel.AttendanceNotes = match.Notes;
            //    var usermatch = userList.FirstOrDefault(r => r.Id == match.RecorderId);
            //    if (usermatch != null) userViewModel.RecorderName = usermatch.FirstName + ' ' + usermatch.LastName;
            //}

            return Ok(userVms);
        }

        [HttpPost]
        public IHttpActionResult RemoveMemberFromMeeting(XMeetingUserViewModel data)
        {

            // remove attendance record if it exist
            var attrec =
                Ctx.Attendances.FirstOrDefault(
                    r =>
                        r.UserId == data.UserId && r.MeetingId == data.MeetingId &&
                        DbFunctions.TruncateTime(r.DateRecorded) == DbFunctions.TruncateTime(data.EffectiveDate.Value));

            if (attrec != null)
            {
                Ctx.Attendances.Remove(attrec);
                Ctx.SaveChanges();
            }


            var xref = Ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.UserId);

            if (xref == null) return NotFound();
            xref.Active = false;
            Ctx.SaveChanges();

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.RemoveMember(data);
            return Ok();
        }


        [HttpPost]
        public IHttpActionResult AddMemberToMeeting(XMeetingUserViewModel data)
        {

            var xref = Ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.UserId);

            if (xref == null)
            {
                xref = Ctx.X_User_Meeting.Create();
                xref.UserId = data.UserId;
                xref.MemberType = data.MemberType;
                xref.MeetingId = data.MeetingId;
                xref.EffectiveDate = data.EffectiveDate ?? DateTime.Now;
                xref.Active = true;
                Ctx.X_User_Meeting.Add(xref);

            }
            else
            {
                var efModel = Mapper.Map<X_User_Meeting>(data);
                Common.MergeObjects(efModel, xref);
                xref.Active = true;
            }


            Ctx.SaveChanges();




            var attendanceVm = new AttendanceViewModel()
            {
                Id = 0,
                AttendType = AttendTypeEnum.Unknown,
                UserId = data.UserId,
                MeetingId = data.MeetingId,
                MemberType = data.MemberType

            };

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.UpdateAttendance(attendanceVm);

            return Ok();
        }

        [HttpPost]
        public IHttpActionResult SaveMeeting(MeetingViewModel meetingViewModel)
        {

            var meeting = Mapper.Map<Meeting>(meetingViewModel);

            if (meeting.Id == 0)
            {
                meeting.DayOfTheWeek = (int)DateTime.Now.DayOfWeek;
                Ctx.Meetings.Add(meeting);

            }
            else
            {

                var meetingTarget = Ctx.Meetings.First(r => r.Id == meeting.Id);
                Common.MergeObjects(meeting, meetingTarget);

            }
            Ctx.SaveChanges();
            return Ok(meeting.Id);

        }




    }
}
