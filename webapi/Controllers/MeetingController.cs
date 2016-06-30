using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.ViewModels;
using AutoMapper;
using NewData;
using webapi.Hubs;
using webapi.Mappers;


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
        public IHttpActionResult GetMeetingMembers(int meetingId)
        {

            var users =
                (from u in _ctx.Users
                 join x in _ctx.X_User_Meeting on u.Id equals x.UserId
                 where x.MeetingId == meetingId && 
                 x.Active
                 select u);

            var userViewModels = _mapper.Map<List<UserViewModel>>(users);

            var attendances = (from a in _ctx.Attendances
                join u in _ctx.Users on a.UserId equals u.Id
                where a.MeetingId == meetingId
                      && (DbFunctions.TruncateTime(a.MeetingDate.Value) == DbFunctions.TruncateTime(DateTime.Today))
                select new
                    {
                        a.Id,
                        a.UserId,
                        a.IsAttend,
                        a.RecorderId,
                        a.LastUpdated,
                        a.Notes
                    }).ToList();

            var userList = _ctx.Users.ToList();
            foreach (var userViewModel in userViewModels)
            {
                var match = attendances.FirstOrDefault(r => r.UserId == userViewModel.Id);
                if (match == null) continue;
                userViewModel.IsAttend = match.IsAttend;
                userViewModel.RecorderId = match.RecorderId;
                userViewModel.AttendanceId = match.Id;
                userViewModel.LastRecorded = match.LastUpdated;
                userViewModel.AttendanceNotes = match.Notes;
                var usermatch = userList.FirstOrDefault(r => r.Id == match.RecorderId);
                if (usermatch != null) userViewModel.RecorderName = usermatch.FirstName + ' ' + usermatch.LastName;
            }

            return Ok(userViewModels);
        }

        [HttpPost]
        public IHttpActionResult RemoveMemberFromMeeting(XMeetingMemberModel data)
        {

            // remove attendance record if it exist
            var attrec =
                _ctx.Attendances.FirstOrDefault(
                    r =>
                        r.UserId == data.MemberId && r.MeetingId == data.MeetingId &&
                        r.DateRecorded > DateTime.Today);

            if (attrec != null)
            {
                _ctx.Attendances.Remove(attrec);
                _ctx.SaveChanges();
            }


            var xref = _ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.MemberId);

            if (xref == null) return NotFound();
            xref.Active = false;
            xref.LastDeactivatedDate = DateTime.Now;
            _ctx.SaveChanges();

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.RemoveMember(data);
            return Ok();
        }


        [HttpPost]
        public IHttpActionResult AddMemberToMeeting(XMeetingMemberModel data)
        {

            var xref = _ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.MemberId);

            if (xref == null)
            {
                xref = _ctx.X_User_Meeting.Create();
                xref.UserId = data.MemberId;
                xref.MeetingId = data.MeetingId;
                xref.DateAdded = DateTime.Now;
                xref.Active = true;
                _ctx.X_User_Meeting.Add(xref);

            }
            else
            {
                xref.LastReactivatedDate = DateTime.Now;
                xref.Active = true;
            }


            _ctx.SaveChanges();


            var attendanceVm = new AttendanceViewModel()
            {
                Id = 0,
                IsAttend = null,
                UserId = data.MemberId,
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
                meeting.DateCreated = DateTime.Now;
                meeting.DayOfTheWeek = (int)DateTime.Now.DayOfWeek;
            }
            _ctx.Meetings.Add(meeting);
            _ctx.SaveChanges();
            return Ok(meeting.Id);

        }

    }
}
