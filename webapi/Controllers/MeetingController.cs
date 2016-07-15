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

        readonly IMapper _mapper;
        private readonly CStatsEntities _ctx;

        public MeetingController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            _mapper = config.CreateMapper();
            _ctx = new CStatsEntities();
        }

        [HttpGet]
        public IHttpActionResult GetAllMeetings()
        {
            var meetings = _ctx.Meetings.ToList();

            return Ok(_mapper.Map<List<MeetingViewModel>>(meetings));
        }

        [HttpGet]
        public IHttpActionResult GetAllMeetingTypes()
        {
            var meetingTypes = _ctx.MeetingTypes.ToList();

            return Ok(_mapper.Map<List<MeetingTypeViewModel>>(meetingTypes));
        }


        [HttpGet]
        public IHttpActionResult GetMeetingMembers(int meetingId, DateTime meetingDate)
        {


            var attendances = (from a in _ctx.Attendances
                where a.MeetingId == meetingId
                      && (DbFunctions.TruncateTime(a.MeetingDate.Value) == DbFunctions.TruncateTime(meetingDate))
                select new
                    {
                        a.Id,
                        a.UserId,
                        a.AttendType,
                        a.RecorderId,
                        a.ModifiedDate,
                        a.Notes
                    });

            var listXUserId =
                _ctx.X_User_Meeting.Where(x => x.MeetingId == meetingId && x.Active.Value && x.EffectiveDate <= meetingDate)
                    .Select(r => r.UserId);

            var listUserId = attendances.Select(a => a.UserId);

            var totalListUserId = listXUserId.Concat(listUserId).Distinct();

            var users = (from u in _ctx.Users
                join l in totalListUserId on u.Id equals l
                select u);

            var userViewModels = _mapper.Map<List<UserViewModel>>(users);

            var userList = _ctx.Users.ToList();

            foreach (var userViewModel in userViewModels)
            {
                var match = attendances.FirstOrDefault(r => r.UserId == userViewModel.Id);
                if (match == null)
                {
                    userViewModel.AttendType = AttendTypeEnum.Unknown;
                    continue;
                }
                userViewModel.AttendType = match.AttendType;
                userViewModel.RecorderId = match.RecorderId;
                userViewModel.AttendanceId = match.Id;
                userViewModel.LastRecorded = match.ModifiedDate;
                userViewModel.AttendanceNotes = match.Notes;
                var usermatch = userList.FirstOrDefault(r => r.Id == match.RecorderId);
                if (usermatch != null) userViewModel.RecorderName = usermatch.FirstName + ' ' + usermatch.LastName;
            }

            return Ok(userViewModels);
        }

        [HttpPost]
        public IHttpActionResult RemoveMemberFromMeeting(XMeetingUserViewModel data)
        {

            // remove attendance record if it exist
            var attrec =
                _ctx.Attendances.FirstOrDefault(
                    r =>
                        r.UserId == data.UserId && r.MeetingId == data.MeetingId &&
                        DbFunctions.TruncateTime(r.DateRecorded) == DbFunctions.TruncateTime(data.EffectiveDate.Value));

            if (attrec != null)
            {
                _ctx.Attendances.Remove(attrec);
                _ctx.SaveChanges();
            }


            var xref = _ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.UserId);

            if (xref == null) return NotFound();
            xref.Active = false;
            _ctx.SaveChanges();

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.RemoveMember(data);
            return Ok();
        }


        [HttpPost]
        public IHttpActionResult AddMemberToMeeting(XMeetingUserViewModel data)
        {

            var xref = _ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.UserId);

            if (xref == null)
            {
                xref = _ctx.X_User_Meeting.Create();
                xref.UserId = data.UserId;
                xref.MeetingId = data.MeetingId;
                xref.EffectiveDate = data.EffectiveDate ?? DateTime.Now;
                xref.Active = true;
                _ctx.X_User_Meeting.Add(xref);

            }
            else
            {
                xref.Active = true;
            }


            _ctx.SaveChanges();


            

            var attendanceVm = new AttendanceViewModel()
            {
                Id = 0,
                AttendType = AttendTypeEnum.Unknown,
                UserId = data.UserId,
                MeetingId = data.MeetingId
                
            };

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.UpdateAttendance(attendanceVm);

            return Ok();
        }

        [HttpPost]
        public IHttpActionResult SaveMeeting(MeetingViewModel meetingViewModel)
        {

            var meeting = _mapper.Map<Meeting>(meetingViewModel);

            if (meeting.Id == 0)
            {
                meeting.DayOfTheWeek = (int) DateTime.Now.DayOfWeek;
                _ctx.Meetings.Add(meeting);

            }
            else
            {

                var meetingTarget = _ctx.Meetings.First(r => r.Id == meeting.Id);
                Common.MergeObjects(meeting, meetingTarget);

            }
            _ctx.SaveChanges();
            return Ok(meeting.Id);

        }




    }
}
