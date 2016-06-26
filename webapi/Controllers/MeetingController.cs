using System;
using System.Collections.Generic;
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

        [HttpPost]
        public IHttpActionResult SaveMeeting(MeetingViewModel meetingViewModel)
        {

            var meeting = _mapper.Map<Meeting>(meetingViewModel);
            if (meeting.Id == 0)
            {
                meeting.DateCreated = DateTime.Now;
                //meeting.DayOfTheWeek = DateTime.Now.DayOfWeek;
            }
            _ctx.Meetings.Add(meeting);
            _ctx.SaveChanges();
            return Ok(meeting.Id);

        }


        //public bool AddUserToMeeting(int userId, int meetingId)
        //{
        //    return _meetingLogic.AddUserToMeeting(userId, meetingId);
        //}

        //public IEnumerable<MeetingViewModel> GetMeetingsByUser(int userId)
        //{
        //    return _mapper.Map<IEnumerable<Meeting>, IEnumerable<MeetingViewModel>>(_meetingLogic.GetMeetingsByUser(userId));
        //}

        //public IEnumerable<MeetingTypeViewModel> GetMeetingType()
        //{
        //    return _mapper.Map<IEnumerable<MeetingType>, IEnumerable<MeetingTypeViewModel>>(_meetingLogic.GetMeetingType());
        //}
        //public bool SaveMeeting(string meetingName, int meetingTypeId)
        //{
        //    return _meetingLogic.SaveMeeting(meetingName, meetingTypeId);
        //}
    }
}
